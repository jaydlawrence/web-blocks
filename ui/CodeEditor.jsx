var React = require('react');

//setBlocks(0,10,0,100,10,100,1)

var scriptStorage = new ScriptStorage();

Object.defineProperty(window, 'hi', {
  get: function() {
    return 'Hi there!';
  }
});

Object.defineProperty(window, 'help', {
  get: function() {
    return ['Help goes here', 'more help'].join('\n');
  }
});

var CodeEditor = React.createClass({
  getInitialState: function() {
    return { mode: 'console', lines: ['Hello there, here you can write JavaScript! For more info type: help'] };
  },
  processCmd: function(e) {
    if (e.which === 13) {
      var cmd = this.refs.code.getDOMNode().value;
      this.refs.code.getDOMNode().value = '';
      this.addLine(cmd);
      this.runCmd(cmd);
    }
  },
  addLine: function(line) {
    var lines = this.state.lines;
    lines.push(line);
    this.setState({ lines: lines });
  },
  runCmd: function(code) {
    var that = this;

    try {
      var func = new Function('return ' + code);
      var res = func();
      if (res) this.addLine(res.toString());
    } catch (err) {
      this.addLine(err.toString());
      console.error('parse error', err);
    }
  },
  runClicked: function() {
    var scriptTextarea = this.refs.script.getDOMNode();

    scriptStorage.putScript('Current', scriptTextarea.value);

    try {
      var scriptCode = scriptTextarea.value;
      var func = new Function(scriptCode);
      func();
    } catch (err) {
      alert(err);
      console.error('parse error', err);
    }
  },
  loadClicked: function() {

  },
  saveClicked: function() {

  },
  tabClick: function(mode) {
    this.setState({ mode: mode });
  },
  linesClick: function(e) {
    var consoleTextarea = this.refs.code.getDOMNode();
    consoleTextarea.focus();
    e.preventDefault();
  },
  componentDidMount: function() {
    var scriptTextarea = this.refs.script.getDOMNode();

    scriptTextarea.value = scriptStorage.getScript('Current');
  },
  componentDidUpdate: function() {
    var consoleTextarea = this.refs.code.getDOMNode();
    var scriptTextarea = this.refs.script.getDOMNode();
    var ul = this.refs.lines.getDOMNode();

    if (this.state.mode === 'console') consoleTextarea.focus();
    if (this.state.mode === 'script') scriptTextarea.focus();

    ul.scrollTop = ul.scrollHeight;
  },
  render: function() {
    var items = this.state.lines.map(function(line, index) {
      return <li key={index}>{line}</li>;
    });

    return (
    <div className={'codeEditor ' + (this.props.visible ? 'show' : 'hide')}>
      <div className="tabs">
        <div className="tab">
          <a onClick={this.tabClick.bind(this, 'console')}>Console</a>
        </div>
        <div className="tab">
          <a onClick={this.tabClick.bind(this, 'script')}>Script</a>
        </div>
      </div>
      <div className={'codeView console ' + (this.state.mode === 'console' ? 'show' : 'hide')}>
        <ul ref="lines" onClick={this.linesClick}>
          {items}
          <li><textarea ref="code" onKeyUp={this.processCmd}></textarea></li>
        </ul>
      </div>
      <div className={'codeView script ' + (this.state.mode === 'script' ? 'show' : 'hide')}>
        <textarea ref="script"></textarea>
        <div className="buttons">
          <button onClick={this.loadClicked}>Load</button>
          <button onClick={this.runClicked}>Run</button>
          <button onClick={this.saveClicked}>Save</button>
        </div>
      </div>
    </div>
    );
  }
});

function ScriptStorage() {
  function getScriptNames() {
    return ['Current'];
  }

  function getScript(name) {
    if (name === 'Current') {
      return window.localStorage.currentScript || '';
    }
  }

  function putScript(name, script) {
    if (name === 'Current') {
      window.localStorage.currentScript = script;
    }
  }

  return {
    getScriptNames: getScriptNames,
    getScript: getScript,
    putScript: putScript
  };
}

module.exports = CodeEditor;
