[![deno CI](https://github.com/joshuabowers/grphcl/actions/workflows/ci.yml/badge.svg)](https://github.com/joshuabowers/grphcl/actions/workflows/ci.yml)

[Available on Pages](https://joshuabowers/github.io/grphcl)

# grphcl

A browser-based graphing calculator

## Use

grphcl provides three main user interface components: a keypad for
mobile-friendly entry, a REPL-style terminal for collating inputs and outputs,
and a graph view for selectively plotted graphs.

Users can enter the formulae they are interested in evaluating via the keypad;
the current expression will be built next to the λ in the terminal, usually near
the bottom. Once ready, the user can then hit the "EXE" key to execute their
expression, which will be evaluated for syntax errors and reduced semantically
to a more canonical form. Users can then select any validated expression they
have entered within the terminal to view a plot of it in the graph view. Plots
can be turned off, either entirely or per expression.

## Supported Types

Users can input boolean values, integers and reals, and complex numbers.
(Internally, integers, reals, and complex numbers are stored within IEEE 754
doubles, so they /will/ present precision and accuracy artifacts. Please do not
rely upon grphcl for anything mission-critical.)

## Variables

The calculator keeps a set of scopes for variables: the global (default) scope
will have all variable assignments the user is likely to make; additionally,
invoked expressions will allow parameters to shadow global variables within the
context of the invocation.

Variables are either bound or unbound: they have a value assigned to them via
the assignment operator or via invocation, or they evaluate to `nil`. An unbound
variable can be used to create expressions in that unbound variable. So, for
example: `cos(x)` will represent th cosine function applied to the variable `x`.
Unbound variables do /not/ need to be defined prior to use.

Variables can be assigned expressions in unbound variables. For example,
`y := x^2 - 3` will assign the value of `y` to the expression on the right-hand
side. `y` can latter be invoked to evaluate a supplied value for `x`: `y(5)`
would yield value of `22`.

## Supported Functions

grphcl supports a number of different mathematical functions and operators, most
of which have been defined to work on all numerical types.
