---
layout: default
---

# Operands

Like in real math in Just functional an operand can be a number, a constant like Pi, or a variable.

## Variables

Variables are defined in the string when creating the function and they are assigned values when evaluating through the EvaluationContext class. Variables are **case sensitive**.

### Variable Provider

The role of variable providers is to "say" what are the variables that you Function will support. By default the library will use the EvaluationContext to get the variables. But let say that you need to validate user input and you only allow functions with this variables: X,Y,Z then evaluating a function with another variable like 'J' will fail even if the values are supplied in the EvaluationContext, to achieve this you could use the PredefinedVariablesProvider.

At the moment there are two variables provider availables:

#### EvaluationContextVariablesProvider

This is the default provider and it will try to get all the available variables from the Evaluation Context whenever you evaluate your function (Evaluate|EvaluateAsync).
Note that when using the compiled evaluator this proccess is only done the first time you are Evaluating the function.

To use this provider you can do the following:

```C#
//Using the Options Directly:
string fx = "(X*4)^2";

var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: null, //You need to pass null as the Value for Variables Provider
    cultureProvider: new CultureProvider()
);

var f1 = new Function(fx, options);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 144
```

```C#
// Using the Factory:
string fx = "(X*4)^2";

var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithEvaluationContextVariablesProvider();

});

var f1 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 144
```

#### PredefinedVariablesProvider

This will give you the possibility to restrict variables in the expressions. It can be use like this:

```C#
//Using the Options Directly:
string fx = "(X*4)^2";

var variablesProvider = new PredefinedVariablesProvider(new[] { "X" });
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: variablesProvider,
    cultureProvider: new CultureProvider()
);

var f1 = new Function(fx, options);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);
Console.WriteLine(result);//output: 144


var f2 = new Function("Y+3", options);
var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["Y"] = 3 });
//'Y' is in the expression and is passed in the context, but this will fail:
f2.Evaluate(evaluationContext);//Will fail
```

```C#
// Using the Factory:
string fx = "(X*4)^2";
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithPredefinedVariables("X");
});
var f1 = factory.Create(fx);

var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);
Console.WriteLine(result);//output: 144


var f2 = factory.Create("Y+3");
var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["Y"] = 3 });
//'Y' is in the expression and is passed in the context, but this will fail:
f2.Evaluate(evaluationContext);//Will fail
```

## Constants

You can use constants in your expressions, by default the library provides some but you can add more. Constants are **case sensitive**.

### Default Constants

By Default the library use the **DefaultTokensProvider** class that is responsible for Operators and Constants available to your function. And comes with the following Constants:

| Expression | Value          |
| ---------- | -------------- |
| pi         | System.Math.PI |
| e          | System.Math.E  |

### Custom Constants

The following example shows how to create a function with another constant:

```C#
//Using the Options Directly:
string fx = "X+c";
var constant = new Constant("c", 1);


var defaultTokenProvider = new DefaultTokensProvider();
var allConstants = defaultTokenProvider.GetAvailableConstants().ToList();
allConstants.Add(constant);
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new CustomizableTokensProvider(defaultTokenProvider.GetAvailableOperators(), allConstants),
    variablesProvider: null,
    cultureProvider: new CultureProvider()
);

var f1 = new Function(fx, options);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 4
```

```C#
// Using the Factory:
string fx = "X+c";
var constant = new Constant("c", 1);

var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    options.WithCustomTokenProvider(tokenOptions =>
        tokenOptions.WithConstant(constant)
    )
);

var f1 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 4
```

Note that constants should be **immutable** objects.

## What's next

You can learn the more about the [Operators](operators.html) or go to the [docs](../).
