<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;800&display=swap');
</style>

<p align="center">
  <a href="https://elastasks.vercel.app/">
    <h2 align="center" style="margin-bottom: -20px">🔦</h2>
    <h2 align="center" style="margin-bottom: -10px">elasTasks</h2>
  </a>
  <p align="center">The missing UI wrapper around selected parts of the ElasticSearch Tasks API</p>
</p>

![Demo](https://i.ibb.co/XDdGLPx/download-2.png)

---

## Background

Inspired by a [closed Kibana github issue](https://github.com/elastic/kibana/issues/42621):

> Long-running tasks can leak processes and kill a cluster. Users need a way to detect slow queries and kill these tasks. We can start down the road of addressing this problem by building a “Tasks” app that show a list of all tasks that are running, indicate ones that are cancellable, display any available information that the API provides, and give users the ability to cancel these tasks.

## Getting Started

On the web:

- Visit [elastasks.vercel.app](https://elastasks.vercel.app/)

Locally:

1. [Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github) this repository
2. `cd app`
3. `npm install && npm run start`
