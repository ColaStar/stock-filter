export default {
    val: (name, search = window.location.search) => search ? (search.substring(search.indexOf('?') + 1).match(new RegExp(`(?:(?:^|&)${name}=)([^&]*)`)) || ['', ''])[1] : ''
}