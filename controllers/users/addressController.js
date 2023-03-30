import Address from '../../model/addressModel'


export const handleGetAddress = async (req, res) => {
    const { id } = req.params;
    try {
        Address.findById(id).lean().exec((err, address) => {
            if (err) {
                res.status(400).json({ message: 'The address does not exisit' });
            } else {
                res.status(200).json({ address: address });
            }
        })
    } catch (error) {
        res.status(500).redirect('/error')
    }
}

export const handleUpdateAddress = async (req, res) => {
    const { id } = req.params;
    try {
        Address.findByIdAndUpdate(id, req.body, {new: true}).lean().exec((err, address) =>{
            if(err){
                console.log(err);
                res.status(400).json({message: 'Somthing went wrong'})
            } else {
                res.status(200).json({updated:address})
            }
        })
    } catch (error) {
        res.status(500).redirect('/error');
    }
}

export const handleDeleteAddress = async (req, res) => {
    const {id} = req.params;
    console.log(id)
    try {
        Address.deleteOne({_id: id}).exec(err =>{
            if(err){
                console.log(err);
                res.status(400).json({message: 'Somthing went wrong'})
            }
            res.status(200).json({message: 'address hass been deleted succesfully'})
        })
    } catch (error) {
        res.status(500).redirect('/error')
    }
}