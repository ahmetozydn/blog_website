const  get404Page = (req, res) => {
    res.status(404).render('404', { title: '404' });
}

module.exports = { errorPage : get404Page};