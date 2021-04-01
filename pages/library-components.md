---
layout: default
---

# Library Components

## Function

The function class is the entry point for Just Functional it can be constructed in serveral ways.

```C#
static void Main(string[] args)
{
    string fx = "(X*4)^2";
    //Using the default Configuration:
    var f1 = new Function(fx);

    //Using the Options Directly:
    var options = new FunctionOptions(
        evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
        tokensProvider: new DefaultTokensProvider(),
        variablesProvider: null //null will use EvaluationContextVariablesProvider
    );
    var f2 = new Function(fx, options);

    // Using the Factory:
    var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    {
        options
            .WithEvaluationContextVariablesProvider()
            .WithDefaultsTokenProvider()
            .WithCompiledEvaluator();
    });
    var f3 = factory.Create(fx);

    //Use:
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    Console.WriteLine(f1.Evaluate(evaluationContext));//output: 144
    Console.WriteLine(f2.Evaluate(evaluationContext));//output: 144
    Console.WriteLine(f3.Evaluate(evaluationContext));//output: 144
}
```

In the code above f1, f2, f3 are using the same configuration.

### Evaluation Context

The EvaluatorContext class is the way you supply variables values at runtime and is really straight-forward to use.

```C#
//Using Constructor:
var context1 = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });

//Registering variables manually:
var context2 = new EvaluationContext();
context2.RegisterVariable("X", 3);
```

The code above shows you how you can create a context with "X=3".

## Operands

### Constants

### Variables

## Operators

### Default Operators

## Exception Handling

## Low Level Components

### Evaluators

#### PostfixCompiledExpressionEvaluator

#### PostfixExpressionInMemoryEvaluator

### Tokenizers

Note: this site is still under construction as 2021/03/30.
