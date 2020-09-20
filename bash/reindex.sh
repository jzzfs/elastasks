sleep 5s;
curl -XPOST "http://localhost:9200/_reindex" -H 'Content-Type: application/json' -d'{"source":{"index":"aae"},"dest":{"index":"aae200"}}';
curl -XPOST "http://localhost:9200/_reindex" -H 'Content-Type: application/json' -d'{"source":{"index":"aae"},"dest":{"index":"aae201"}}';
curl -XPOST "http://localhost:9200/_reindex" -H 'Content-Type: application/json' -d'{"source":{"index":"aae"},"dest":{"index":"aae202"}}';
