const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query, run, get } = require('../database/connection');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, nome, email, created_at, updated_at FROM usuarios ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new user
router.post('/', auth, [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;

    // Check if user already exists
    const existingUser = await get('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe com este email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Create user
    const result = await run(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hashedPassword]
    );

    // Get the created user
    const user = await get('SELECT id, nome, email, created_at, updated_at FROM usuarios WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await get(
      'SELECT id, nome, email, created_at, updated_at FROM usuarios WHERE id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update user
router.put('/:id', auth, [
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('senha').optional().isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nome, email, senha } = req.body;

    // Check if user exists
    const existingUser = await get('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await get('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
      if (emailCheck) {
        return res.status(400).json({ error: 'Email já está em uso por outro usuário' });
      }
    }

    // Build update query
    let updateQuery = 'UPDATE usuarios SET updated_at = CURRENT_TIMESTAMP';
    const params = [];

    if (nome) {
      updateQuery += ', nome = ?';
      params.push(nome);
    }

    if (email) {
      updateQuery += ', email = ?';
      params.push(email);
    }

    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      updateQuery += ', senha = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await run(updateQuery, params);

    // Get updated user
    const updatedUser = await get('SELECT id, nome, email, created_at, updated_at FROM usuarios WHERE id = ?', [id]);

    res.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await get('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Delete user
    await run('DELETE FROM usuarios WHERE id = ?', [id]);

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
