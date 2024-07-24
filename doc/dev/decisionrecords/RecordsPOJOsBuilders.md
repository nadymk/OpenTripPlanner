## Records, POJOs and Builders

We prefer immutable typesafe types over flexibility and "short" class definitions. This makes
the code more robust and less error-prone. References to other entities might need to be mutable,
if so try to init them once, and throw an exception if set again. Example:

```java
Builder initStop(Stop stop) {
   this.stop = requireNotInitialized(this.stop, stop);
}
```


### Records

You may use records, but avoid using records if you can not encapsulate it properly. Be especially
aware of arrays fields (can not be protected) and collections (remember to make a defensive copy).
If you need to override `equals` and `hashCode`, then it is probably not worth it.
Be aware that `equals` compare references, not the value of a field. Consider overriding `toString`.

### Builders

OTP used a simple builder pattern in many places, especially when creating immutable types.

#### Builder conventions
- Use factory methods to create builder, either `of()` or `copyOf()`. The _copyOf_ uses an existing
  instance as its base. The `of()` creates a builder with all default values set. All constructors
  should be private (or package local) to enforce the use of the factory methods.
- If the class has more than 5 fields, then avoid using an inner class builder, instead create a 
  builder in the same package.
- Make all fields in the main class final to enforce immutability.
- Consider using utility methods for parameter checking, like `Objects#requireNonNull` and
  `ObjectUtils.ifNotNull`.
- Validate all fields in the main type constructor(i.e. not in the builder), especially null checks.
  Prefer default values over null-checks. All business logic using the type can rely on its validity.
- You may keep the original instance in the builder to avoid creating a new object if nothing
  changed. This prevents polluting the heap for long-lived objects and make comparison very fast.
- There is no need to provide all get accessors in the Builder if not needed.
- Unit-test builders and verify all fields are copied over.
- For nested builders see the field `nested` in the example.

<details>
    <summary><b>Builder example</b></summary>

```Java
/**
 * THIS CLASS IS IMMUTABLE AND THREAD-SAFE
 */
public class A {
  public static final A DEFAULT = new A();
  private final List<String> names;
  private final int age;
  private final B nested;

  private A() {
    this.names = List.of("default");
    this.age = 7;
    this.nested = B.of();
  }

  private A(Builder builder) {
    this.names = List.copyOf(builder.names);
    this.age = builder.age;
    this.nested = builder.nested();

    if(age < 0 || age > 150) {
      throw new IllegalArgumentException("Age is out of range[0..150]: " + age);
    }
  }

  public static A.Builder of() { return DEFAULT.copyOf(); }
  public A.Builder copyOf() { return new Builder(this); }

  public List<String> listNames() { return names; }
  public int age()                { return age; }

  public boolean equals(Object other) { ... }
  public int hashCode()               { ... }
  public String toString()            { return ToStringBuilder.of(A.class)...; }

  public static class Builder {
    private final A original;
    private final List<String> names;
    private int age;
    private B.Builder nested = null;

    public Builder(A original) {
      this.original = original;
      this.names = new ArrayList<>(original.names);
      this.age = original.age;
    }

    public Builder withName(String name) { this.names.add(name); return this; }
    
    public int age()                     { return age; }
    public Builder withAge(int age)      { this.age = age; return this; }
    
    private B nested() { return nested==null ? original.nested() : nested.build(); } 
    public Builder withB(Consumer<B.Builder> body) {
      if(nested == null) { nested = original.nested.copyOf(); } 
      body.accept(nested);
      return this;
    }
    public A build() {
      A value = new A(this);
      return original.equals(value) ? original : value;
    }
  }
}
```

</details>