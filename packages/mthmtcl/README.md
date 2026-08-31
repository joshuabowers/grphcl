# mthmtcl

A basic math library, in TypeScript. Represents mathematical operations as
abstract syntax trees, upon which available functions operate.

## The Parser

The library comes with its own syntactical parser, built on a parsing expression
grammar. The `parse` function, available in the default entry point, is capable
of matching a range of different mathematical expressions (albeit, inspired by
the limitations of modern programming languages).

```ts
import { parser } from "@bowers/mthmtcl";

const anAddition = parse("x + 1");
```

The return value of `parse` is a subclass of `TreeNode`, the base class of the
library's underlying AST hierarchy.

The parser does not perform semantic analysis as part of its behavior: it is
purely about syntactical validation and building an exact AST reprsentation of
the input string fed to it. To semantically evaluate the node that is returned,
`invoke` it:

```ts
import { invoke, parser } from "@bowers/mthmtcl";

const realExponentiation = parse("5 ** 2");
const result = invoke()(readExponentiation)();
// => `result` will be Real-flavored, a data type the
// library supports.
```

This process can be simplified by using the `evaluate` utility function, which
returns a tuple containing the origin AST and its result:

```ts
import { evaluate } from "@bowers/mthmtcl";

const result = evaluate("5 ** 2");
console.log(result[0].toString()); // => 5 ** 2
console.log(result[1].toString()); // => 25
```

## The Tree

The library contains a modest abstract syntax tree class hierachy. These are
produced automatically by the parser, and are operated upon by the math
functions. For the most part, a user of the library shouldn't have to worry too
much about what these classes are; instead, that they exist and are the unit of
storage for processing contexts.

Each parsing and every function call generates a new tree. Any given tree is
immutable---its properties are readonly, and none of its methods alter internal
state---and rooted at the syntactically least precedent operation of the input
expression.

For the interested seeking greater knowledge, one can either consult the
[source](https://github.com/joshuabowers/grphcl/tree/main/packages/mthmtcl/tree)
for the library on GitHub, or browse through the
[documentation](https://jsr.io/@bowers/mthmtcl/doc/tree) on JSR.

## The Functions

The library exposes a collection of functions which operate on its AST node
class instances to calculate the mathematical functions they represent. Which is
to say: they do the math.

One of these functions has already been met: `invoke`! Invocation, from a formal
term in programming languages for calling a function, establishes a temporary
scope into which variables are assigned values, then evaluates the passed
expression; any instances of variables found in the expression which are defined
in that temporary scope are replaced _in situ_.

Most of the other functions aren't as complicated and are more intuitive, as
they have been designed to feel relatively math like.

In general, most of the functions have the following behaviors:

1. They provide raw numerical analysis: each function is capable of performing
   the underlying math when all their inputs are numerical tree nodes.
2. They perform algebraic and symbolic analyses: various functions, most notably
   `add` and `multiply`, look for patterns in their inputs that have
   well-defined, conventional semantic equivalences. When one of these patterns
   is matched, the functions will respond with what is called a tree rewrite:
   they substitute, as result, a new tree that is semantically equivalent, but
   syntactically simpler.
3. They generate an AST node instance that is flavored to the functions
   associated class type if they aren't otherwise able to reduce their children
   under the rules of that function.

These analyses can lead to some interesting results:

```ts
import { parse } from "@bowers/mthtmtcl";

const input = parse("x ** 2 / x");
const result = invoke()(input)(); // => variable('x')
```

A full listing of the supported functions can either be found within the
[source]() of the project, or the interested can refer to the [documentation]().
