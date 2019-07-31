'use strich'

exports.ok = (value,res) => {
    const data = {
        status : 200,
        value : value
    }
    res.json(data)
    res.end()
}

exports.error = (data, res, code=400) => {
    const value= {
        status : "failed",
        data : data
    };

    res.status(code);
    res.json(value);
    res.end();
};
