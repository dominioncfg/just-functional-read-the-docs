---
layout: default
---

# The Big Picture

Just functional is a math evaluator that you can use in your C# projects, its design with simplicity in mind and supports basic features like:

    - Syntax Validation
    - Variables
    - Constants
    - Custom Operators

## Design Principles

### Immutability

You should know that the Function class and everything in it is immutable, that is, after the creation of the object is not posible to change anything (expression, evaluator, operators, constants etc), the reason for this is that immutable objects have several advangages, like there is no side-effects, improve performance, maintanibilty, and keep things simple. If you need to construct many function with the same configuration you should use the factory version.

### Easy to use

Just functional allows you to configure your functions in an fluent manner making things easier for you as you don’t need to know many of the low level details so you can focus on your use case.

## Use Cases

This section is all about exposing the use cases of the library.

[Evaluation](evaluation.html)

[Syntax Validation](syntax-validation.html)

## What's next

You can learn the more about the  [Functions](functions.html) or go to the [docs](../).
