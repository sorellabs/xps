bin = $(shell npm bin)
sjs = $(bin)/sjs


# -- Configuration -----------------------------------------------------
TEST_DIR = test/specs-src
TEST_BLD = test/specs
TEST_SRC = $(wildcard $(TEST_DIR)/*.sjs)
TEST_TGT = ${TEST_SRC:$(TEST_DIR)/%.sjs=$(TEST_BLD)/%.js}


# -- Compilation -------------------------------------------------------
$(TEST_BLD)/%.js: $(TEST_DIR)/%.sjs
	mkdir -p $(dir $@)
	$(sjs) --module specify-assertions/macros \
	       --module specify-assertions/macros/futures \
	       --module specify-core/macros \
	       --module sweet-fantasies/src/do \
	       --output $@ \
	       $<


# -- Tasks -------------------------------------------------------------
test: $(TEST_TGT)
	node test/run

clean:
	rm -f $(TEST_TGT)

.PHONY: test clean
