Redirect with ease – the Google Load Balancer friendly version.

```
docker run \
	-p 3000:3000
	--env PORT=3000
	--env REDIRECT_URL=https://hon.gy/
	--env STATUS=302
	hongymagic/redirect:latest

curl -I http://localhost:3000/?utm_campaign=hongy
```

#### Running on Google Cloud

Any GLB or K8S health checks which is detected by these user agents:

```
GoogleHC
kube-probe
```

Will return empty body with 200 OK. These should satisfy both kubernetes and GLB
health check requirements.
