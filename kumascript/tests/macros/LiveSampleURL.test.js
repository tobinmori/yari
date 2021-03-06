/**
 * @prettier
 */
const { assert, itMacro, describeMacro, beforeEachMacro } = require("./utils");

describeMacro("LiveSampleURL", function () {
  beforeEachMacro(function (macro) {
    macro.ctx.info.hasPage = jest.fn((path) => true);
  });
  itMacro("Production settings", function (macro) {
    macro.ctx.env.live_samples = {
      base_url: "https://mdn.mozillademos.org",
    };
    macro.ctx.env.url =
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p";
    return assert.eventually.equal(
      macro.call("Example"),
      "https://mdn.mozillademos.org/en-US/docs/Web/HTML/Element/p/_samples_/Example"
    );
  });
  itMacro("Override page URL", function (macro) {
    macro.ctx.env.live_samples = {
      base_url: "https://mdn.mozillademos.org",
    };
    macro.ctx.env.url =
      "https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/How_to_build_custom_form_widgets";
    return assert.eventually.equal(
      macro.call(
        "No_JS",
        "https://developer.mozilla.org/en-US/docs/HTML/Forms/How_to_build_custom_form_widgets/Example_2"
      ),
      "https://mdn.mozillademos.org/en-US/docs/HTML/Forms/How_to_build_custom_form_widgets/Example_2/_samples_/No_JS"
    );
  });
  itMacro("Override with nonexistent page URL", async (macro) => {
    macro.ctx.env.live_samples = {
      base_url: "https://mdn.mozillademos.org",
    };
    macro.ctx.info.hasPage = jest.fn((path) => false);
    macro.ctx.info.getDescription = jest.fn((url) => url.toLowerCase());
    macro.ctx.env.path = "/en-US/docs/Learn/HTML";
    macro.ctx.env.url = `https://developer.mozilla.org${macro.ctx.env.path}`;
    await expect(
      macro.call(
        "No_JS",
        "https://developer.mozilla.org/en-US/docs/does/not/exist"
      )
    ).rejects.toThrow(
      "/en-us/docs/learn/html references /en-us/docs/does/not/exist, which does not exist"
    );
  });
  itMacro("Staging settings", function (macro) {
    macro.ctx.env.live_samples = {
      base_url: "https://files-stage.mdn.mozit.cloud",
    };
    macro.ctx.env.url =
      "https://developer.allizom.org/en-US/docs/Web/CSS/background-color";
    return assert.eventually.equal(
      macro.call("Examples"),
      "https://files-stage.mdn.mozit.cloud/en-US/docs/Web/CSS/background-color/_samples_/Examples"
    );
  });
  itMacro("Development default settings", function (macro) {
    macro.ctx.env.live_samples = { base_url: "http://localhost:8000" };
    macro.ctx.env.url = "http://localhost:8000/en-US/docs/Web/HTML/Element/p";
    return assert.eventually.equal(
      macro.call("Example"),
      "http://localhost:8000/en-US/docs/Web/HTML/Element/p/_samples_/Example"
    );
  });
  itMacro("Unicode ID", function (macro) {
    macro.ctx.env.live_samples = {
      base_url: "https://mdn.mozillademos.org",
    };
    macro.ctx.env.url =
      "https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-direction";
    return assert.eventually.equal(
      macro.call("例子"),
      "https://mdn.mozillademos.org/zh-CN/docs/Web/CSS/flex-direction/_samples_/%E4%BE%8B%E5%AD%90"
    );
  });
  itMacro("Development demo settings", function (macro) {
    macro.ctx.env.live_samples = { base_url: "http://demos:8000" };
    macro.ctx.env.url = "http://localhost:8000/en-US/docs/Web/HTML/Element/p";
    return assert.eventually.equal(
      macro.call("Example"),
      "http://demos:8000/en-US/docs/Web/HTML/Element/p/_samples_/Example"
    );
  });
});
