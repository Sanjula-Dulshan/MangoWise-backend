import axios from 'axios';

export const getLocationData = async (req, res) => {
    
    const lat = req.query.lat;
    const long = req.query.long;
    
    const url = `http://api.positionstack.com/v1/reverse?access_key=69782d5e96b55452faff3250239c1c8d&query=${lat},${long}`;
    return axios.get(url)
    .then((response) => {
        console.log("AAA : "+response.data.data[0].region);
        res.json(response.data.data[0].region);
    })
    .catch((error) => {
        console.log(error);
    })

}