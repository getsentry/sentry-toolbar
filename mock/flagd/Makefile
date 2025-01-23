run:
	docker run \
		--rm -it \
		--name flagd \
		-p 8013:8013 \
		-v $(shell pwd)/config:/etc/flagd \
		ghcr.io/open-feature/flagd:latest start \
		--uri file:/etc/flagd/demo.flagd.json
