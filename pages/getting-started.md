---
layout: default
---

# Getting Started

## Installation

You can install the package by adding this reference to the .csproj:

```C#
<PackageReference Include="JustFunctional.Core" Version="2.0.1" />
```

or by using this command in the console:

```bash
dotnet add package JustFunctional.Core --version 2.0.1
```

You can find the package in nuget **[here](https://www.nuget.org/packages/JustFunctional.Core/)** for more details.

## Usage

### Evaluate a function directly

You can start evaluating with the default configuration using the **Function** class:

```C#
string fx = "(X*4)^2";
Function f = new Function(fx);
decimal result =  f.Evaluate(new EvaluationContext(new Dictionary<string, decimal>() { ["X"] = 3 }));
//result = 144
```

or evaluate an constant expression like this:

```C#
string fx = "(3*4)^2";
Function f = new Function(fx);
decimal result = f.Evaluate(new EvaluationContext());
//result = 144
```

### Using an IoC Container

If you are using an IoC Container we recommend to use the **IFunctionFactory** and that way all of your **Function** instances will share the same configuration:

1- **Create and extension method:**

```C#
using Microsoft.Extensions.Hosting;
public static class JustFunctionalExtensions
{
    
    public static IServiceCollection AddJustFunctional(this IServiceCollection services)
    {
        var factory = FunctionFactoryBuilder.ConfigureFactory(options =>
        {
            options
                .WithEvaluationContextVariablesProvider()
                .WithDefaultsTokenProvider()
                .WithCompiledEvaluator();
        });
        services.AddSingleton<IFunctionFactory>(factory);
        return services;
    }
}
```

2- **Register the factory with the IoC Container:**

```C#
public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddJustFunctional();
    ...
}
```

3- **Use in a controller or in any other place:**

```C#
using JustFunctional.Core;
[ApiController()]
[Route("api/maths")]
public class MathController : ControllerBase
{
    private readonly IFunctionFactory _functionFactory;

    public MathController(IFunctionFactory functionFactory)
    {
        _functionFactory = functionFactory;
    }

    [HttpGet("evaluate")]
    public async Task<decimal> Evaluate([FromQuery] decimal x)
    {
        string fx = "(X*4)^2";
        Function f = _functionFactory.Create(fx);
        return await f.EvaluateAsync(new EvaluationContext(new Dictionary<string, decimal>() {["X"] = x}));
    }
}
```

Note that EvaluateAsync supports Parallel calls without any Issue.

### Validate if an expression is syntactically correct

You can use the **TryCreate** before evaluating a given function to make sure the expression is correct

```C#
[HttpGet("is-valid")]
public  TryCreateFunctionResult IsValid([FromQuery] string fx)
{
    var allowedVariables = new PredefinedVariablesProvider("X");
    TryCreateFunctionResult result = _functionFactory.TryCreate(fx,allowedVariables);
    return result;
}
```

## What's next

You can learn the more about in the [Overview](the-big-picture.html) or go to the [docs](../).
