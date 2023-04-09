---
layout: default
---

# Try It Out

## Live

<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<div id="app" class="try-out-app"></div>
<script src="/just-functional-read-the-docs/assets/js/try-out.js?v=80dfb069870c526bbde5fdc2c9f15db973c5854d"></script>

## Just Functional Web

Just functional web is a reference web api for Just Functional, you can check the source code and aditional information [here](https://github.com/dominioncfg/just-functional-web).

### Run with docker

You can use the following script to create a docker container from the image:

```bash
docker run -dt --name my-evaluator -p 5698:80 josecdom94/just-functional-api:2.0.2
```

If everything went well swagger should be now listening at <http://localhost:5698/swagger>

### Download run and use the app

You can more details [here](https://github.com/dominioncfg/just-functional-web).

## What's next

You can learn the more about in the [Overview](the-big-picture.html) or go to the [docs](../).
