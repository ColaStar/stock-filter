import '../scss/loading.scss';

class Loading {
    constructor(options = {}) {
        this.options = options;
        this.loading = document.createElement('div');
        this.loading.innerHTML = '<div class="loading js-loading"> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> </div>';
        this.hide();
        (this.options.container || document.body).appendChild(this.loading);
    }
    show() {
        this.loading.style.display = 'block';
    }
    hide() {
        this.loading.style.display = 'none';
    }
}

export default Loading;