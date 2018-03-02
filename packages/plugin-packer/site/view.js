'use strict';

/**
 * View class
*/
class View {
  /**
   * @constructor
   * @param {Object<string, HTMLElement>} elements
   */
  constructor(elements) {
    this.$ = elements;
  }
  /**
   * Show the element on the display
   * @param {HTMLElement} el
   */
  show(el) {
    el.classList.remove('hide');
  }
  /**
   * Hide the element on the display
   * @param {HTMLElement} el
   */
  hide(el) {
    el.classList.add('hide');
  }
  /**
   * Render the view with a passed state
   * @param {Object} state
   */
  render(state) {
    this.renderResult(state);
    this.renderUploadPPKArea(state);
    this.renderUploadZipArea(state);
    this.renderBtn(state);
  }
  /**
   * Decorate the element for drag over
   * @param {HTMLElement} el
   */
  decorateDragOver(el) {
    el.classList.add('upload-area__droppable--drag');
  }
  /**
   * Decorate the element for drag leave
   * @param {HTMLElement} el
   */
  decorateDragLeave(el) {
    el.classList.remove('upload-area__droppable--drag');
  }
  /**
   * Render a botton area with a passed state
   * @param {Object} state
   */
  renderBtn(state) {
    if (state.loading) {
      this.show(this.$.createLoadingBtn);
      this.hide(this.$.createBtn);
    } else {
      this.show(this.$.createBtn);
      this.hide(this.$.createLoadingBtn);
    }
    if (state.contents.data) {
      this.$.createBtn.classList.remove('disabled');
    } else if (!state.loading) {
      this.$.createBtn.classList.add('disabled');
    }
  }
  /**
   * Render an area for upload plugin zip with a passed state
   * @param {Object} state
   */
  renderUploadZipArea(state) {
    this.decorateDragLeave(this.$.zipDropArea);
    if (state.contents.data) {
      this.show(this.$.zipOkIcon);
    } else {
      this.hide(this.$.zipOkIcon);
    }
    if (state.contents.name) {
      this.$.zipFileName.textContent = state.contents.name;
    } else {
      this.$.zipFileName.textContent = '...';
    }
  }
  /**
   * Render an area for upload ppk with a passed state
   * @param {Object} state
   */
  renderUploadPPKArea(state) {
    this.decorateDragLeave(this.$.ppkDropArea);
    if (state.ppk.data) {
      this.show(this.$.ppkOkIcon);
    } else {
      this.hide(this.$.ppkOkIcon);
    }
    if (state.ppk.name) {
      this.$.ppkFileName.textContent = state.ppk.name;
    } else {
      this.$.ppkFileName.textContent = '...';
    }
  }
  /**
   * Render a result to create a plugin zip with a passed state
   * @param {Object} state
   */
  renderResult(state) {
    if (state.error) {
      this.renderErrorMessages(state);
    } else if (state.plugin.url.contents) {
      this.renderDownloadLinks(state);
    } else {
      this.hide(this.$.error);
      this.hide(this.$.download);
    }
  }
  /**
   * Render download links for a plugin zip and ppk with a passed state
   * @param {Object} state
   */
  renderDownloadLinks(state) {
    this.hide(this.$.error);
    this.show(this.$.download);
    this.$.downloadPluginId.textContent = state.plugin.id;
    this.$.downloadPlugin.href = state.plugin.url.contents;
    this.$.downloadPPK.href = state.plugin.url.ppk;
  }
  /**
   * Render error messages for the result of creating a plugin zip with a passed state
   * @param {Object} state
   */
  renderErrorMessages(state) {
    this.hide(this.$.download);
    this.show(this.$.error);
    const e = state.error;
    let errors = e.validationErrors;
    if (!e.validationErrors) {
      errors = [e.message];
    }
    const ul = this.$.errorMessages;
    ul.innerHTML = '';
    errors.forEach(error => {
      const li = document.createElement('li');
      li.textContent = error;
      ul.appendChild(li);
    });
  }
}
module.exports = View;
