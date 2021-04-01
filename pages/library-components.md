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

You should know also that the Function class and everything in it is inmutable, that is, after the creation of the object is not posible to change anything (expression, evaluator, etc), the reason for this that inmutable objects have several advangages, like there is no side-effects, improve performance, maintanibilty, and keep things simple. If you need to construnct many function with the same configuration you should use the factory version.

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

Like in real math in Just functional an operand can be a number, a constant like Pi, or a variable.

### Variables

Variables are defined in the string when creating the function and they are assigned values when evaluating throught the EvaluationContext class. Variables are **case sensitive**

#### Variable Provider

The role of variable providers is to "say" what are the variables that you Function will support. Out of the box the library will use the EvaluationContext to get the variables. But let say that you need to validate user input and you only allow functions with this variables: X,Y,Z then evaluating a function with another variable like 'J' will fail even if the values are supplied in the EvaluationContext, to acheive this you could use the PredefinedVariablesProvider.

At the moment there are two variables provider availables:

##### EvaluationContextVariablesProvider

This is the default provider and it will try to get all the available variables from the Evaluation Context whenever you evaluate your functon (Evaluate|EvaluateAsync).
Note that when using the compiled evaluator this proccess is only done the first time you are Evaluating the function.

To use this provider you can do the following:

```C#
//Using the Options Directly:
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: null //You need to pass null as the Value for Variables Provider
);
var f1 = new Function(fx, options);

// Using the Factory:
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithEvaluationContextVariablesProvider();
        
});
var f2 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
Console.WriteLine(f1.Evaluate(context));//output: 144
Console.WriteLine(f2.Evaluate(context));//output: 144
```

##### PredefinedVariablesProvider

This will give you the possibilty to restrict variables in the expressions. It can be use like this:

```C#
//Using the Options Directly:
var variablesProvider = new PredefinedVariablesProvider(new[] { "X" });
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
    variablesProvider: variablesProvider
);
var f1 = new Function(fx, options);

// Using the Factory:
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
{
    options
        .WithPredefinedVariables("X");        
});
var f2 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
Console.WriteLine(f1.Evaluate(context));//output: 144
Console.WriteLine(f2.Evaluate(context));//output: 144

//'Y' is in the expression and is passed in the context, but this will fail:
var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["Y"] = 3 });
var f3 = new Function("Y+3", options);
var f4 = factory.Create("Y+3");
f3.Evaluate(evaluationContext);//Will fail
f4.Evaluate(evaluationContext);//Will fail
```

### Constants

You can use constants in your expressions, by default the library provides some you can add more. Tokens are **case sensitive**

#### Default Constants

| Expression| Value   |
| ----------| --------|
| pi        | Math.PI |
| e         | Math.E  |

#### Custom Constants

The following example shows how to create a function with another constant:

```C#
string fx = "X+c";
var constant = new Constant("c", 1);

//Using the Options Directly:
var defaultTokenProvider = new DefaultTokensProvider();
var allConstants = defaultTokenProvider.GetAvailableConstants().ToList();
allConstants.Add(constant);

var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new CustomizableTokensProvider(defaultTokenProvider.GetAvailableOperators(), allConstants),
    variablesProvider: null
);
var f1 = new Function(fx, options);

// Using the Factory:
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    options.WithCustomTokenProvider(tokenOptions=>
        tokenOptions.WithConstant(constant)
    )
);
var f2 = factory.Create(fx);

var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
Console.WriteLine(f1.Evaluate(context));//output: 4
Console.WriteLine(f2.Evaluate(context));//output: 4
```

## Operators

### Default Operators

### Custom Operators

## Exception Handling

## Low Level Components

### Evaluators

#### PostfixCompiledExpressionEvaluator

#### PostfixExpressionInMemoryEvaluator

### Tokenizers

Note: this site is still under construction as 2021/03/30.
