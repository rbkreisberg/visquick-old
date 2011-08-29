JS_COMPILER = \
	./lib/uglifyjs/bin/uglifyjs

JSDOCTEMPLATEDIR = \
		/local/tools/jsdoc-toolkit/templates/jsdoc

JSDOC_COMPILER = \
		/local/tools/jsdoc-toolkit/jsrun.sh -t=$(JSDOCTEMPLATEDIR)

all: \
	vq.js \
	vq.min.js \
	vq.circvis.js \
	vq.circvis.min.js \
	vq.linear_browser.js \
	vq.linear_browser.min.js \
	vq.brush_link.js \
	vq.brush_link.min.js \
	vq.chromavis.js \
	vq.chromavis.min.js \
	vq.cubbyhole.js \
	vq.cubbyhole.min.js \
	vq.violinplot.js \
	vq.violinplot.min.js \
	vq.par_coord.js \
	vq.par_coord.min.js

.INTERMEDIATE vq.js: \
	vq.core.js 

vq.core.js: \
	src/core/base.js \
	src/core/vis.js \
	src/core/models.js \
	src/core/utils.js \
	src/core/events.js \
	src/core/hovercard.js \
	src/core/pv.behavior.flextip.js \
	src/core/pv.behavior.hovercard.js 

vq.circvis.js: \
	src/circvis/circvis.js 

vq.linear_browser.js: \
	src/linear_browser/linear_browser.js 

vq.brush_link.js: \
	src/brush_link/brush_link.js

vq.chromavis.js: \
	src/chromavis/chromavis.js

vq.cubbyhole.js: \
	src/cubbyhole/cubbyhole.js

vq.violinplot.js: \
	src/violinplot/violinplot.js

vq.par_coord.js: \
	src/par_coord/parallel_coordinates.js

%.min.js: %.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@

vq.js vq%.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a-w $@

docs:
	mkdir docs
	$(JSDOC_COMPILER) . -d=docs

clean_docs:
	rm -rf docs\

clean:
	rm -f vq*.js
