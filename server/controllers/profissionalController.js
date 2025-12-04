const Profissional = require ('../models/profissionalModel');
const bcrypt = require('bcrypt');

//GET /profissionais
exports.listar = async (req, res)=>{
  try{
    const profissionais = await Profissional.findAll({
      attributes: {exclude: ['senha_hash']}
    })
    res.json(profissionais)
  }catch (error){
    res.status(500).json({erro: 'Erro ao listar profissionais.'})
  }
}

//GET /medicos
exports.listarMedicos = async (req, res)=>{
  try{
    const medicos = await Profissional.findAll({
      where: { perfil: 'medico', status: true},
      attributes: ['id', 'nome', 'especialidade', 'crm']
    })
    res.json(medicos)
  }catch(error){
    res.status(500).json({erro: 'Erro ao listar médicos.'})
  }
}

//POST /profissionais
exports.criar = async (req, res) => {
  try{
    const { nome, email, senha, crm, especialidade, perfil } = req.body;

    //Criptografar senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);
  
    const novo = await Profissional.create({
      nome,
      email,
      senha_hash,
      crm,
      especialidade,
      perfil,
      status: true
    });

    novo.senha_hash = undefined;
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar profissional', detalhe: error.message })
  };

//DELETE /profissonais/:id
exports.deletar = async (req, res)=>{
  try{
    const profissional = await Profissional.findByPK(req.params.id);
    if(!profissional) return res.status(404).json({erro: 'Profissonal não encontrado!'});
    
    await profissional.destroy();
    res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir profissonal.'});
    }
  }
}