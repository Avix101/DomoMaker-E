const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.element) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    element: req.body.element,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, domos) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos });
  });
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.id) {
    return res.status(400).json({ error: 'RAWR! Cannot delete unspecified domo' });
  }

  const domoId = req.body.id;

	// Remove the requested domo- but filter by session owner and id
	// We don't want someone who doesn't own the domo to be able to delete it
  const domoPromise = Domo.DomoModel.remove({ _id: domoId, owner: req.session.account._id });

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

module.exports = {
  makerPage,
  getDomos,
  make: makeDomo,
  deleteDomo,
};
