---
layout: default
#title: "Getting Started | Just Functional"
#permalink: /pages/getting-started.html
---

# Getting Started

## Installation

You can install the package by adding this reference to the .csproj:

```C#
<PackageReference Include="JustFunctional.Core" Version="1.0.9" />
```

or by using this command in the console:

```C#
dotnet add package JustFunctional.Core --version 1.0.9
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
[ApiController]
[Route("[controller]")]
public class MathController : ControllerBase
{
    private readonly IFunctionFactory _functionFactory;
    public MathController(IFunctionFactory functionFactory)
    {
        _functionFactory = functionFactory;
    }
    [HttpGet]
    public async Task<decimal> Get()
    {
        string fx = "(X*4)^2";
        Function f = _functionFactory.Create(fx);
        return await f.EvaluateAsync(new EvaluationContext(new Dictionary<string, decimal>() { ["X"] = 3 }));
    }
}
```

Note that EvaluateAsync supports Parallel calls without any Issue.

## What's next

You can learn more about how to customize the library [here](just-functional-home/)

