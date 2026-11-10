import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.GenericArrayType;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.lang.reflect.WildcardType;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;

/**
 * Runs a Java solution against JSON tests.
 *
 * Usage: java Driver job.json results.jsonl
 *
 * The job names the class and method to call; each test's JSON arguments are converted to the
 * method's declared parameter types via reflection, and the return value is written back as JSON,
 * one line per test, so a timeout still leaves the finished tests readable.
 */
public class Driver {
    /** Problems with the test harness itself (bad signature, unconvertible input), as opposed to errors in the solution. */
    static class DriverError extends RuntimeException {
        DriverError(String message) {
            super(message);
        }
    }

    private static final int MAX_LIST_NODES = 1_000_000;

    @SuppressWarnings("unchecked")
    public static void main(String[] argv) throws Exception {
        String input = new String(Files.readAllBytes(Paths.get(argv[0])), StandardCharsets.UTF_8);
        Map<String, Object> job = (Map<String, Object>) Json.parse(input);
        PrintStream realOut = System.out;
        PrintStream realErr = System.err;
        try (PrintStream results = new PrintStream(new FileOutputStream(argv[1]), true, "UTF-8")) {
            for (Object item : (List<Object>) job.get("tests")) {
                Map<String, Object> test = (Map<String, Object>) item;
                // System.out and System.err both go to the test's output log, in the order they were printed.
                ByteArrayOutputStream captured = new ByteArrayOutputStream();
                PrintStream log = new PrintStream(captured, true, "UTF-8");
                System.setOut(log);
                System.setErr(log);
                Map<String, Object> result = new LinkedHashMap<>();
                long started = System.nanoTime();
                try {
                    Object got = "class".equals(job.get("kind")) ? runClass(job, test) : runFunction(job, test);
                    result.put("got", Json.write(got)); // JSON text, parsed again by the reader
                } catch (InvocationTargetException e) {
                    result.put("error", describe(e.getCause()));
                } catch (DriverError e) {
                    result.put("driver_error", e.getMessage());
                } catch (Throwable e) {
                    result.put("error", describe(e));
                } finally {
                    log.flush();
                    System.setOut(realOut);
                    System.setErr(realErr);
                }
                result.put("ms", Math.round((System.nanoTime() - started) / 1e5) / 10.0);
                result.put("stdout", captured.toString("UTF-8"));
                results.println(Json.write(result));
            }
        }
    }

    @SuppressWarnings("unchecked")
    static Object runFunction(Map<String, Object> job, Map<String, Object> test) throws Exception {
        Class<?> cls = loadClass((String) job.get("className"));
        List<Object> args = (List<Object>) test.get("args");
        Method method = findMethod(cls, (String) job.get("method"), args.size());
        Object target = Modifier.isStatic(method.getModifiers()) ? null : construct(cls, new ArrayList<>());
        Object[] converted = convertAll(method.getGenericParameterTypes(), args, method.getName());
        Object returned = emptyNodeAsList(method.invoke(target, converted), method.getReturnType());
        Object mutates = job.get("mutates");
        return mutates == null ? returned : converted[((Number) mutates).intValue()];
    }

    @SuppressWarnings("unchecked")
    static Object runClass(Map<String, Object> job, Map<String, Object> test) throws Exception {
        Class<?> cls = loadClass((String) job.get("className"));
        List<Object> ops = (List<Object>) test.get("ops");
        List<Object> allArgs = (List<Object>) test.get("args");
        List<Object> outputs = new ArrayList<>();
        Object instance = construct(cls, (List<Object>) allArgs.get(0));
        outputs.add(null);
        for (int i = 1; i < ops.size(); i++) {
            List<Object> args = (List<Object>) allArgs.get(i);
            Method method = findMethod(cls, (String) ops.get(i), args.size());
            Object returned = method.invoke(instance, convertAll(method.getGenericParameterTypes(), args, method.getName()));
            outputs.add(method.getReturnType() == void.class ? null : emptyNodeAsList(returned, method.getReturnType()));
        }
        return outputs;
    }

    /** An empty linked list or tree is null in Java but [] in the tests' JSON. */
    static Object emptyNodeAsList(Object value, Class<?> declared) {
        boolean nodeType = declared == ListNode.class || declared == TreeNode.class;
        return value == null && nodeType ? new ArrayList<>() : value;
    }

    static Class<?> loadClass(String name) {
        try {
            return Class.forName(name);
        } catch (ClassNotFoundException e) {
            throw new DriverError("Define a class named " + name + ".");
        }
    }

    static Method findMethod(Class<?> cls, String name, int arity) {
        for (Method m : cls.getDeclaredMethods()) {
            if (m.getName().equals(name) && m.getParameterCount() == arity) {
                m.setAccessible(true);
                return m;
            }
        }
        throw new DriverError("Define a method " + name + " with " + arity + " parameter" + (arity == 1 ? "" : "s") + " in class " + cls.getName() + ".");
    }

    static Object construct(Class<?> cls, List<Object> args) throws Exception {
        for (Constructor<?> c : cls.getDeclaredConstructors()) {
            if (c.getParameterCount() == args.size()) {
                c.setAccessible(true);
                return c.newInstance(convertAll(c.getGenericParameterTypes(), args, cls.getName()));
            }
        }
        throw new DriverError("Class " + cls.getName() + " needs a constructor with " + args.size() + " parameter" + (args.size() == 1 ? "" : "s") + ".");
    }

    static Object[] convertAll(Type[] types, List<Object> args, String where) {
        Object[] out = new Object[types.length];
        for (int i = 0; i < types.length; i++) {
            try {
                out[i] = convert(args.get(i), types[i]);
            } catch (DriverError | ClassCastException | NumberFormatException e) {
                throw new DriverError("Can't pass test input " + Json.write(args.get(i)) + " as parameter " + (i + 1)
                        + " of " + where + " (declared " + types[i].getTypeName() + "). Check the parameter types.");
            }
        }
        return out;
    }

    // ---------- JSON value -> declared Java type ----------

    @SuppressWarnings({"unchecked", "rawtypes"})
    static Object convert(Object value, Type type) {
        if (type instanceof WildcardType) {
            return convert(value, ((WildcardType) type).getUpperBounds()[0]);
        }
        if (type instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) type;
            Class<?> raw = (Class<?>) pt.getRawType();
            Type[] params = pt.getActualTypeArguments();
            if (value == null) return null;
            if (Map.class.isAssignableFrom(raw)) {
                Map out = SortedMap.class.isAssignableFrom(raw) ? new TreeMap<>() : new HashMap<>();
                for (Map.Entry<String, Object> e : ((Map<String, Object>) value).entrySet()) {
                    out.put(convertKey(e.getKey(), params[0]), convert(e.getValue(), params[1]));
                }
                return out;
            }
            if (Iterable.class.isAssignableFrom(raw)) {
                Collection out = newCollection(raw);
                for (Object item : (List<Object>) value) out.add(convert(item, params[0]));
                return out;
            }
            return convert(value, raw);
        }
        if (type instanceof GenericArrayType) {
            Type component = ((GenericArrayType) type).getGenericComponentType();
            List<Object> list = (List<Object>) value;
            Object[] out = (Object[]) Array.newInstance(rawClass(component), list.size());
            for (int i = 0; i < list.size(); i++) out[i] = convert(list.get(i), component);
            return out;
        }
        Class<?> cls = (Class<?>) type;
        if (value == null) {
            if (cls.isPrimitive()) throw new DriverError("null for a primitive");
            return null;
        }
        if (cls == int.class || cls == Integer.class) return ((Number) value).intValue();
        if (cls == long.class || cls == Long.class) return ((Number) value).longValue();
        if (cls == double.class || cls == Double.class) return ((Number) value).doubleValue();
        if (cls == float.class || cls == Float.class) return ((Number) value).floatValue();
        if (cls == short.class || cls == Short.class) return ((Number) value).shortValue();
        if (cls == byte.class || cls == Byte.class) return ((Number) value).byteValue();
        if (cls == boolean.class || cls == Boolean.class) return (Boolean) value;
        if (cls == char.class || cls == Character.class) {
            if (value instanceof String && ((String) value).length() == 1) return ((String) value).charAt(0);
            if (value instanceof Number) return (char) ((Number) value).intValue();
            throw new DriverError("not a single character");
        }
        if (cls == String.class) {
            if (value instanceof String) return value;
            throw new DriverError("not a string");
        }
        if (cls == BigInteger.class) return value instanceof BigInteger ? value : BigInteger.valueOf(((Number) value).longValue());
        if (cls == ListNode.class) return toListNode((List<Object>) value);
        if (cls == TreeNode.class) return toTreeNode((List<Object>) value);
        if (cls.isArray()) {
            Class<?> component = cls.getComponentType();
            if (component == char.class && value instanceof String) return ((String) value).toCharArray();
            List<Object> list = (List<Object>) value;
            Object out = Array.newInstance(component, list.size());
            for (int i = 0; i < list.size(); i++) Array.set(out, i, convert(list.get(i), component));
            return out;
        }
        if (Iterable.class.isAssignableFrom(cls)) {
            Collection out = newCollection(cls);
            out.addAll((List<Object>) value);
            return out;
        }
        if (Map.class.isAssignableFrom(cls)) return new HashMap<>((Map<String, Object>) value);
        if (cls == Object.class) return value;
        throw new DriverError("unsupported type " + cls.getName());
    }

    static Object convertKey(String key, Type type) {
        Class<?> cls = rawClass(type);
        if (cls == Integer.class) return Integer.valueOf(key);
        if (cls == Long.class) return Long.valueOf(key);
        if (cls == Double.class) return Double.valueOf(key);
        if (cls == Character.class && key.length() == 1) return key.charAt(0);
        return key;
    }

    static Class<?> rawClass(Type type) {
        if (type instanceof Class) return (Class<?>) type;
        if (type instanceof ParameterizedType) return (Class<?>) ((ParameterizedType) type).getRawType();
        if (type instanceof GenericArrayType) return Array.newInstance(rawClass(((GenericArrayType) type).getGenericComponentType()), 0).getClass();
        return Object.class;
    }

    @SuppressWarnings("rawtypes")
    static Collection newCollection(Class<?> raw) {
        if (Set.class.isAssignableFrom(raw)) return new HashSet<>();
        if (Deque.class.isAssignableFrom(raw) && !List.class.isAssignableFrom(raw)) return new ArrayDeque<>();
        if (Queue.class.isAssignableFrom(raw)) return new LinkedList<>();
        return new ArrayList<>();
    }

    static ListNode toListNode(List<Object> values) {
        ListNode dummy = new ListNode();
        ListNode tail = dummy;
        for (Object v : values) {
            tail.next = new ListNode(((Number) v).intValue());
            tail = tail.next;
        }
        return dummy.next;
    }

    /** LeetCode level order: children of each non-null node in turn, null for a missing child. */
    static TreeNode toTreeNode(List<Object> values) {
        if (values.isEmpty() || values.get(0) == null) return null;
        TreeNode root = new TreeNode(((Number) values.get(0)).intValue());
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < values.size()) {
            TreeNode node = queue.poll();
            if (i < values.size() && values.get(i) != null) {
                node.left = new TreeNode(((Number) values.get(i)).intValue());
                queue.add(node.left);
            }
            i++;
            if (i < values.size() && values.get(i) != null) {
                node.right = new TreeNode(((Number) values.get(i)).intValue());
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    static String describe(Throwable e) {
        StringBuilder sb = new StringBuilder(e.toString());
        int shown = 0;
        for (StackTraceElement frame : e.getStackTrace()) {
            String c = frame.getClassName();
            boolean internal = c.startsWith("java.") || c.startsWith("jdk.") || c.startsWith("sun.")
                    || c.equals("Driver") || c.startsWith("Driver$") || c.equals("Json");
            if (internal) continue;
            sb.append("\n    at ").append(frame);
            if (++shown == 8) break;
        }
        return sb.toString();
    }

    // ---------- Minimal JSON reader/writer (no external libraries) ----------

    static final class Json {
        private final String s;
        private int pos;

        private Json(String s) {
            this.s = s;
        }

        static Object parse(String text) {
            Json p = new Json(text);
            Object value = p.value();
            p.skipSpace();
            if (p.pos != text.length()) throw new IllegalArgumentException("trailing characters in JSON");
            return value;
        }

        private void skipSpace() {
            while (pos < s.length() && Character.isWhitespace(s.charAt(pos))) pos++;
        }

        private Object value() {
            skipSpace();
            char c = s.charAt(pos);
            if (c == '{') return object();
            if (c == '[') return array();
            if (c == '"') return string();
            if (s.startsWith("true", pos)) { pos += 4; return Boolean.TRUE; }
            if (s.startsWith("false", pos)) { pos += 5; return Boolean.FALSE; }
            if (s.startsWith("null", pos)) { pos += 4; return null; }
            return number();
        }

        private Map<String, Object> object() {
            Map<String, Object> out = new LinkedHashMap<>();
            pos++;
            skipSpace();
            if (s.charAt(pos) == '}') { pos++; return out; }
            while (true) {
                skipSpace();
                String key = string();
                skipSpace();
                pos++; // ':'
                out.put(key, value());
                skipSpace();
                if (s.charAt(pos++) == '}') return out;
            }
        }

        private List<Object> array() {
            List<Object> out = new ArrayList<>();
            pos++;
            skipSpace();
            if (s.charAt(pos) == ']') { pos++; return out; }
            while (true) {
                out.add(value());
                skipSpace();
                if (s.charAt(pos++) == ']') return out;
            }
        }

        private String string() {
            StringBuilder sb = new StringBuilder();
            pos++; // opening quote
            while (true) {
                char c = s.charAt(pos++);
                if (c == '"') return sb.toString();
                if (c != '\\') { sb.append(c); continue; }
                char e = s.charAt(pos++);
                switch (e) {
                    case 'n': sb.append('\n'); break;
                    case 't': sb.append('\t'); break;
                    case 'r': sb.append('\r'); break;
                    case 'b': sb.append('\b'); break;
                    case 'f': sb.append('\f'); break;
                    case 'u': sb.append((char) Integer.parseInt(s.substring(pos, pos + 4), 16)); pos += 4; break;
                    default: sb.append(e);
                }
            }
        }

        private Object number() {
            int start = pos;
            while (pos < s.length() && "+-0123456789.eE".indexOf(s.charAt(pos)) >= 0) pos++;
            String text = s.substring(start, pos);
            if (text.contains(".") || text.contains("e") || text.contains("E")) return Double.parseDouble(text);
            BigInteger big = new BigInteger(text);
            return big.bitLength() < 64 ? (Object) big.longValue() : big;
        }

        /** Serialise any solution value: primitives, arrays, collections, maps, ListNode, TreeNode. */
        static String write(Object value) {
            StringBuilder sb = new StringBuilder();
            write(value, sb);
            return sb.toString();
        }

        private static void write(Object v, StringBuilder sb) {
            if (v == null) {
                sb.append("null");
            } else if (v instanceof String) {
                quote((String) v, sb);
            } else if (v instanceof Character) {
                quote(String.valueOf(v), sb);
            } else if (v instanceof Boolean || v instanceof Integer || v instanceof Long || v instanceof Short
                    || v instanceof Byte || v instanceof BigInteger) {
                sb.append(v);
            } else if (v instanceof Double || v instanceof Float) {
                double d = ((Number) v).doubleValue();
                // Python's json module reads Infinity/-Infinity/NaN, so non-finite values survive the round trip.
                sb.append(Double.isNaN(d) ? "NaN" : Double.isInfinite(d) ? (d > 0 ? "Infinity" : "-Infinity") : Double.toString(d));
            } else if (v.getClass().isArray()) {
                sb.append('[');
                for (int i = 0, n = Array.getLength(v); i < n; i++) {
                    if (i > 0) sb.append(',');
                    write(Array.get(v, i), sb);
                }
                sb.append(']');
            } else if (v instanceof Iterable) {
                sb.append('[');
                boolean first = true;
                for (Object item : (Iterable<?>) v) {
                    if (!first) sb.append(',');
                    first = false;
                    write(item, sb);
                }
                sb.append(']');
            } else if (v instanceof Map) {
                sb.append('{');
                boolean first = true;
                for (Map.Entry<?, ?> e : ((Map<?, ?>) v).entrySet()) {
                    if (!first) sb.append(',');
                    first = false;
                    quote(String.valueOf(e.getKey()), sb);
                    sb.append(':');
                    write(e.getValue(), sb);
                }
                sb.append('}');
            } else if (v instanceof ListNode) {
                List<Integer> values = new ArrayList<>();
                for (ListNode n = (ListNode) v; n != null; n = n.next) {
                    if (values.size() == MAX_LIST_NODES) throw new IllegalStateException("returned list has a cycle");
                    values.add(n.val);
                }
                write(values, sb);
            } else if (v instanceof TreeNode) {
                write(levelOrder((TreeNode) v), sb);
            } else {
                quote(String.valueOf(v), sb);
            }
        }

        private static List<Integer> levelOrder(TreeNode root) {
            List<Integer> out = new ArrayList<>();
            List<TreeNode> level = new ArrayList<>();
            level.add(root);
            while (!level.isEmpty()) {
                List<TreeNode> next = new ArrayList<>();
                for (TreeNode node : level) {
                    if (node == null) {
                        out.add(null);
                        continue;
                    }
                    out.add(node.val);
                    next.add(node.left);
                    next.add(node.right);
                }
                level = next;
            }
            while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
            return out;
        }

        private static void quote(String text, StringBuilder sb) {
            sb.append('"');
            for (char c : text.toCharArray()) {
                switch (c) {
                    case '"': sb.append("\\\""); break;
                    case '\\': sb.append("\\\\"); break;
                    case '\n': sb.append("\\n"); break;
                    case '\r': sb.append("\\r"); break;
                    case '\t': sb.append("\\t"); break;
                    default:
                        if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                        else sb.append(c);
                }
            }
            sb.append('"');
        }
    }
}
