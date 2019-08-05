class FileReader {

    constructor() {

        const remote = window.require && window.require('electron') && window.require('electron').remote

        if (remote) {

            this.fs = remote.require('fs')
            this.path = remote.require('path')

        }
    }
    
    /**
     * read file from path
     * @param  {...string[]} paths 
     * @returns {Uint8Array}
     */
    async read(...paths) {

        return await this.fs.promises.readFile(this.path.join(...paths))

    }
}

function install(Vue) {

    Vue.mixin({

        beforeCreate() {

            if (this.$options && this.$options.parent && this.$options.parent.$fs) {
                this.$fs = this.$options.parent.$fs
            }

            else if (this.$options && this.$options.fs) {
                this.$fs = this.$options.fs
            }
        }
    })
}

export default {
    FileReader,
    install
}