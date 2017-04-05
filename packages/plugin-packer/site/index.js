'use strict';

require('setimmediate'); // polyfill
const Buffer = require('buffer').Buffer;
const rezip = require('./rezip');
const packer = require('../src/');

// eslint-disable-next-line id-match
const $ = document.querySelector.bind(document);
let contents;
let privateKey;

$('#input .contents').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    contents = reader.result;
    generatePlugin();
  };
  reader.readAsArrayBuffer(file);
});

$('#input .ppk').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
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
  return rezip(Buffer.from(contents))
    .then(contentsZip => packer(contentsZip, privateKey))
    .then(output => {
      console.log('result', output.id);
      outputResult(output);
    }).catch(e => {
      console.error(e);
      outputError(e);
    });
}

function outputResult(output) {
  $('#output-error').classList.add('hide');
  $('#output').classList.remove('hide');
  $('#output .id').textContent = output.id;
  $('#output .plugin').href = URL.createObjectURL(new Blob([output.plugin], {type: 'application/zip'}));
  $('#output .ppk').href = URL.createObjectURL(new Blob([output.privateKey], {type: 'text/plain'}));
}

function outputError(e) {
  $('#output').classList.add('hide');
  $('#output-error').classList.remove('hide');
  let errors = e.validationErrors;
  if (!e.validationErrors) {
    errors = [e.message];
  }
  const ul = $('#output-error .messages');
  ul.innerHTML = '';
  errors.forEach(error => {
    const li = document.createElement('li');
    li.textContent = error;
    ul.appendChild(li);
  });
}
