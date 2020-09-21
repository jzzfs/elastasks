<p align="center" style="text-align: center">
  <a href="https://elastasks.vercel.app/" style="text-align: center">
    <h3 align="center" style="font-weight: bold; text-align: center; font-size: 34px; margin-bottom: -45px">🔦</h3>
    <h3 align="center" style="font-weight: bold; text-align: center; font-size: 34px; margin-bottom: -10px">elasTasks</h3>
  </a>
  <p align="center">The missing UI wrapper around selected parts of the <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/tasks.html" target="_blank">ElasticSearch Tasks API</a></p>
</p>

---

![Demo](https://github.com/jzzfs/elastasks/blob/master/demo.gif)

---

## Background

This application attempts to solve the problem detailed in the [unresolved Kibana issue #42621](https://github.com/elastic/kibana/issues/42621):

> Long-running tasks can leak processes and kill a cluster. Users need a way to detect slow queries and kill these tasks. We can start down the road of addressing this problem by building a “Tasks” app that show a list of all tasks that are running, indicate ones that are cancellable, display any available information that the API provides, and give users the ability to cancel these tasks.

## Getting Started

On the web:

1. Visit [elastasks.vercel.app](https://elastasks.vercel.app/)

Locally:

1. [Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github) this repository
2. `cd app`
3. `npm install && npm run start`

## Privacy

elasTasks is a client-side application with no server backend. Data lives only on your machine/browser. No information or ES data is sent to any server.

When connecting to an ElasticSearch host you may opt out of enabling [CorsAnywhere](https://github.com/Rob--W/cors-anywhere/) -- a NodeJS reverse proxy which adds CORS headers to the proxied request.

## Contributing

Pull requests are welcome.

## Support

If this piece of software brought value to you/your organization,

<a href="https://www.buymeacoffee.com/joejoe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-white.png" alt="Buy Me A Coffee" width="150" ></a>
