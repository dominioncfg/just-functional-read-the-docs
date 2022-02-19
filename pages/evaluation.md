---
layout: default
---

# Evaluation

In this section you will find recipes of how you can use **Just Functional** for the most common scenarios.

## Constant Expressions

```C#
string fx = "(3+2)^2";
Function f = new Function(fx);
decimal result =  f.Evaluate(new EvaluationContext());
```

## Function with single variable

```C#
string fx = "(X+2)^2";
Function f = new Function(fx);
decimal result =  f.Evaluate(new EvaluationContext(new Dictionary<string, decimal>(){["X"]=3}));
//result = 25
```

## Function with multiple variables

```C#
string fx = "(X+Y)^2";
Function f = new Function(fx);
decimal result =  f.Evaluate(new EvaluationContext(new Dictionary<string, decimal>(){["X"]=3,["Y"]=2}));
//result = 25
```

## What's next

You can learn the more about the [Syntax Validation](syntax-validation.html) or go to the [docs](../).
