---
layout: default
---

# Library Components

## Function

The function class is the entry point for Just Functional it can be constructed in several ways.

```C#
static void Main(string[] args)
{
    //Using the default Configuration:
    string fx = "(X*4)^2";

    var f1 = new Function(fx);
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    var result = f1.Evaluate(evaluationContext);

    Console.WriteLine(result);//output: 144
}
```

```C#
static async Task Main(string[] args)
{
    //Using the Options Directly:
    string fx = "(X*4)^2";

    var options = new FunctionOptions(
        evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
        tokensProvider: new DefaultTokensProvider(),
        variablesProvider: null,
        cultureProvider: new CultureProvider()
    );

    var f1 = new Function(fx, options);
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    var result = f1.Evaluate(evaluationContext);

    Console.WriteLine(result);//output: 144
}
```

```C#
static async Task Main(string[] args)
{
    //Using the default Configuration:
    string fx = "(X*4)^2";

    // Using the Factory:
    var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    {
        options
            .WithEvaluationContextVariablesProvider()
            .WithDefaultsTokenProvider()
            .WithCompiledEvaluator()
            .WithSystemProvidedCulture();

    });

    var f1 = factory.Create(fx);
    var evaluationContext = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
    var result = f1.Evaluate(evaluationContext);

    Console.WriteLine(result);//output: 144
}
```

In the code above f1, f2, f3 are using the same configuration.

### Immutability

You should know that the Function class and everything in it is immutable, that is, after the creation of the object is not posible to change anything (expression, evaluator, operators, constants etc), the reason for this is that immutable objects have several advangages, like there is no side-effects, improve performance, maintanibilty, and keep things simple. If you need to construct many function with the same configuration you should use the factory version.

### Evaluation Context

The EvaluatorContext class is the way you supply values to variables at runtime and is really straight-forward to use.

```C#
//Using Constructor:
var context1 = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });

//Registering variables manually:
var context2 = new EvaluationContext();
context2.RegisterVariable("X", 3);
```

The code above shows you how you can create a context with "X=3".

Note that you can create an empty EvaluationContext when you need to evaluate a Function with no variables.

## Operands

Like in real math in Just functional an operand can be a number, a constant like Pi, or a variable.

### Variables

Variables are defined in the string when creating the function and they are assigned values when evaluating through the EvaluationContext class. Variables are **case sensitive**.

#### Variable Provider

The role of variable providers is to "say" what are the variables that you Function will support. By default the library will use the EvaluationContext to get the variables. But let say that you need to validate user input and you only allow functions with this variables: X,Y,Z then evaluating a function with another variable like 'J' will fail even if the values are supplied in the EvaluationContext, to achieve this you could use the PredefinedVariablesProvider.

At the moment there are two variables provider availables:

##### EvaluationContextVariablesProvider

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

##### PredefinedVariablesProvider

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

### Constants

You can use constants in your expressions, by default the library provides some but you can add more. Tokens are **case sensitive**.

#### Default Constants

By Default the library use the **DefaultTokensProvider** class that is responsible for Operators and Constants available to your function. And comes with the following Constants:

| Expression | Value          |
| ---------- | -------------- |
| pi         | System.Math.PI |
| e          | System.Math.E  |

#### Custom Constants

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

Note that Constants are part of ITokensProvider.GetAvailableConstants() method. Also Constants should be immutable objects.

## Operators

Just like constants the library offers the possibility of customize the operators.

### Default Operators

By Default the library use the **DefaultTokensProvider** class that is responsible for Operators and Constants available to your function. And it includes the following Operators:

| Operator                   | Token | Example  | Precedence |
| -------------------------- | ----- | -------- | ---------- |
| Add                        | +     | 3+5      | 1          |
| Substract                  | -     | 5-3      | 1          |
| Multiply                   | *     | 3*2      | 2          |
| Divide                     | /     | 10/2     | 2          |
| SquareRoot                 | sqrt  | sqrt 144 | 3          |
| CubeRoot                   | cbr   | cbr 27   | 3          |
| Exponentiation             | ^     | 2^3      | 3          |
| Cosine                     | cos   | cos 0    | 4          |
| Sine                       | sen   | 1        | 4          |
| CommonLogarithm (log10)    | log   | log 100  | 4          |
| Factorial                  | fac   | fac 4    | 4          |
| Module                     | mod   | mod 5    | 4          |
| NaturalLogarithm   (log e) | ln    | ln 2.2   | 4          |

*The precedence fields determine the priority of the operator.
Ex: Multiply has a priority of 2, Add has a priority of 1 then multiply is executed first.

### Custom Operators

The proccesses of creating an operator and a constants are similar but you need to make a new class that Inhherirs from the class **Operator** becuse they have some behaviour, note that your Operator's derived class should be immutable.

Before also lets have a look at the Operator class and its fields:

| Field         | Description                                  | Example |
| ------------- | -------------------------------------------- | ------- |
| Name          | Friendly Name of the operator                | Add     |
| RawToken      | The Token                                    | +       |
| Precedence    | The Priority of the opertator                | 1       |
| Type          | Numbers of operands requiered (Unary/Binary) | Binary  |
| Associativity | Associativity (Left/Right)                   | Left    |

- Create an operator class:

```C#
public class IncrementOperator : Operator
{
    public IncrementOperator() : base(name: "Increment",
                                      rawToken: "Inc",
                                      precedence: 10,
                                      type: OperatorType.Unary,
                                      associativity: Associativity.Left
                                     )
    {

    }
    public override decimal Calculate(List<Operand> operands, IEvaluationContext context)
    {
        //The operand can be a variable. the ResolveIfVariableOperand check if the operand 
        //is a variable and resolve the value for that variable otherwise 
        //returns the value of the operand itself
        return ResolveIfVariableOperand(operands[0], context) + 1;
    }
}
```

- Create the function with the operator:

```C#
//Using the Options Directly:
string fx = "Inc X";

var defaultTokenProvider = new DefaultTokensProvider();
var allOperators = defaultTokenProvider.GetAvailableOperators().ToList();
allOperators.Add(new IncrementOperator());

var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new CustomizableTokensProvider(allOperators, defaultTokenProvider.GetAvailableConstants()),
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
string fx = "Inc X";

var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
   options.WithCustomTokenProvider(tokenOptions =>
       tokenOptions.WithOperator(new IncrementOperator())
   )
);

var f1 = factory.Create(fx);
var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 4
```

## Exception Handling

All the exceptions in just functional derive from the **JustFunctionalBaseException** so you can use only one catch.
Below is a high level explanation of all other exceptions

| Exception                        | Throws when                                                               | Example                                              |
| -------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- |
| JustFunctionalBaseException      | Base exception class                                                      |                                                      |
| MissingOperandException          | When there is a operator with less operands that required                 | 5+  or -*5                                           |
| MissingOperatorException         | When there are operands that need a operator that is missing              | 5X or 4+5)                                           |
| SyntaxErrorInExpressionException | General syntax error exception                                            | Xabc2. In here operator abc is not defined           |
| VariableUndefinedException       | When the expression needs a variable that is not passed in the Context    | Only applies when using PredefinedVariablesProvider  |

## Low Level Components

### Evaluators

Put it simply the evaluator is the algorithm used to parse and evaluate the functions/expressions.

#### PostfixCompiledExpressionEvaluator

This is default evaluator and it consist an implementation of the [Shunting Yard](https://en.wikipedia.org/wiki/Shunting-yard_algorithm). On the first time you ask to evaluate the function it will compile the expression and then in another step it will evaluate the compiled expression.

#### PostfixExpressionInMemoryEvaluator

This is also a version of the  [Shunting Yard](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) but this time there is no compilation process, it will always compile and evaluate the expression.

#### What Evaluator you should use

The PostfixExpressionInMemoryEvaluator is better when you only need to evaluate a function once and then you will.
The PostfixCompiledExpressionEvaluator (default) is situable for evaluating the same function several times because it compiles the expression only once.

Note that both evaluators are thread safe so you can use it in parallel but for heavy parallel loads you should use the PostfixExpressionInMemoryEvaluator, this one can have better performance becuase at the end both evalutators have the O(n) complexity and the PostfixCompiledExpressionEvaluator needs to compile the expression before is able to evaluate and this part is not pararellizable .

#### Changing the evaluator

You can use the CompiledExpressionEvaluatorFactory/PostfixExpressionInMemoryEvaluator when using constructing the function directly or use the .WithCompiledEvaluator/.WithJustInTimeEvalutator when using the factory.

```C#
//Using the Options Directly:
string fx = "1 + X";
var evaluator = new CompiledExpressionEvaluatorFactory();
//or
//var evaluator = new PostfixExpressionInMemoryEvaluator();
var options = new FunctionOptions(
    evaluatorProvider: new CompiledExpressionEvaluatorFactory(),
    tokensProvider: new DefaultTokensProvider(),
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
string fx = "1 + X";
var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
    options
    .WithCompiledEvaluator()
//or
//.WithJustInTimeEvalutator()
);
var f1 = factory.Create(fx);

var context = new EvaluationContext(new Dictionary<string, decimal> { ["X"] = 3 });
var result = f1.Evaluate(context);

Console.WriteLine(result);//output: 4
```

### Tokenizers

The tokenizer is the object responsible of converting individuals characters in the expression to usable objects that one of the Evaluators make use of.

## What's next

You can learn the more about the  [Roadmap](limitations-and-roadmap.html) or go to the [docs](../)
