'use strict';

require('setimmediate'); // polyfill
const Buffer = require('buffer').Buffer;
const packer = require('../src/');

// eslint-disable-next-line id-match
const $ = document.querySelector.bind(document);
let contents;
let privateKey;

$('#input .contents').addEventListener('change', event => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    contents = reader.result;
    generatePlugin();
  };
  reader.readAsArrayBuffer(file);
});

$('#input .ppk').addEventListener('change', event => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    privateKey = reader.result;
    generatePlugin();
  };
  reader.readAsText(file);
});

function generatePlugin() {
  if (!contents) {
    return Promise.resolve();
  }
  return packer(Buffer.from(contents), privateKey)
    .then(output => {
      console.log('result', output.id);
      outputResult(output);
    });
}

function outputResult(output) {
  $('#output').classList.remove('hide');
  $('#output .id').textContent = output.id;
  $('#output .plugin').href = URL.createObjectURL(new Blob([output.plugin], {type: 'application/zip'}));
  $('#output .ppk').href = URL.createObjectURL(new Blob([output.privateKey], {type: 'text/plain'}));
}
