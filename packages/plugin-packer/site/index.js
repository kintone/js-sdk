'use strict';

require('setimmediate'); // polyfill
const Buffer = require('buffer').Buffer;
const rezip = require('./rezip');
const packer = require('../src/');

const $ = document.querySelector.bind(document);
let contents;
let privateKey;

$('#input .contents').addEventListener('change', function(event) {
  const file = this.files[0];
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

$('#input .ppk').addEventListener('change', function(event) {
  const file = this.files[0];
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
      outputResult(output, !!privateKey);
    }).catch(e => {
      console.error(e);
      outputError(e);
    });
}

function outputResult(output, hasPrivateKey) {
  $('#output-error').classList.add('hide');
  $('#output').classList.remove('hide');
  $('#output .id').textContent = output.id;
  $('#output .plugin').href = URL.createObjectURL(new Blob([output.plugin], {type: 'application/zip'}));
  if (hasPrivateKey) {
    $('#output .ppk').parentNode.classList.add('hide');
  } else {
    $('#output .ppk').parentNode.classList.remove('hide');
    $('#output .ppk').href = URL.createObjectURL(new Blob([output.privateKey], {type: 'text/plain'}));
  }
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
