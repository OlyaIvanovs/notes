export default (value) => {
    var date = new Date(value)
    return date.toLocaleDateString('en-NZ',
     {day: 'numeric', month: 'long', year: 'numeric'})
}