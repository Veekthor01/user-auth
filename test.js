const express = require('express');
const request = require('supertest');
const app = express();
const { connectToDB } = require('./db');
const homeRouter = require('./routes/homeRoute');
const signupRouter = require('./routes/signUpRoute');
const loginRouter = require('./routes/loginRoute');
const dashboardRouter = require('./routes/dashboardRoute');
const logoutRouter = require('./routes/logoutRoute');
const forgotPasswordRouter = require('./routes/forgotPasswordRoute');
const resetPasswordRouter = require('./routes/resetPasswordRoute');

jest.mock('./db', () => ({
  connectToDB: jest.fn(),
}));

app.use('/', homeRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/logout', logoutRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/reset-password', resetPasswordRouter);

describe('Home Routes', () => {
  it('should display home page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

describe('Signup Routes', () => {
  it('should display signup page', async () => {
    const response = await request(app).get('/signup');
    expect(response.status).toBe(200);
  });

  it('should sign up a new user', async () => {
    const mockUser = { email: 'dave@gmail.com', password: 'abcde' };
    const dbInstance = {
      collection: jest.fn().mockReturnThis(),
      insertOne: jest.fn().mockResolvedValue(mockUser),
    };
    connectToDB.mockResolvedValue(dbInstance);

    const response = await request(app).post('/signup').send(mockUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should not sign up a user with an existing email', async () => {
    const mockUser = { email: 'dave@gmail.com', password: 'abcde' };
    const dbInstance = {
      collection: jest.fn().mockReturnThis(),
      insertOne: jest.fn().mockResolvedValue(null),
    };
    connectToDB.mockResolvedValue(dbInstance);

    const response = await request(app).post('/signup').send(mockUser);
    expect(response.status).toBe(401);
  });
});

describe('Login Routes', () => {
  it('should display login page', async () => {
    const response = await request(app).get('/login');
    expect(response.status).toBe(200);
  });

  it('should login a user', async () => {
    const mockUser = { email: 'dave@gmail.com', password: 'abcde' };
    const dbInstance = {
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(mockUser),
    };
    connectToDB.mockResolvedValue(dbInstance);

    const response = await request(app).post('/login').send(mockUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should not login a user with wrong credentials', async () => {
    const mockUser = { email: 'dave@gmail.com', password: 'abcde' };
    const dbInstance = {
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
    };
    connectToDB.mockResolvedValue(dbInstance);

    const response = await request(app).post('/login').send(mockUser);
    expect(response.status).toBe(401);
  });
});

describe('Dashboard Routes', () => {
  it('should display dashboard page', async () => {
    const response = await request(app).get('/dashboard');
    expect(response.status).toBe(200);
  });
});

describe('Logout Routes', () => {
  it('should display logout page', async () => {
    const response = await request(app).get('/logout');
    expect(response.status).toBe(200);
  });
});

describe('Forgot Password Routes', () => {
  it('should display forgot password page', async () => {
    const response = await request(app).get('/forgot-password');
    expect(response.status).toBe(200);
  });

  it('should send a reset password link to the user\'s email', async () => {
    const mockUser = { email: 'dave@gmail.com', password: 'abcde' };
    const dbInstance = {
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(mockUser),
    };
    connectToDB.mockResolvedValue(dbInstance);

    const response = await request(app).post('/forgot-password').send(mockUser);
    expect(response.status).toBe(200);
  });
});

describe('Reset Password Routes', () => {
  it('should display reset password page', async () => {
    const response = await request(app).get('/reset-password');
    expect(response.status).toBe(200);
  });

  it('should reset the user\'s password', async () => {
    const mockUser = { email: 'dave@gmail.com', password: 'abcde' };
    const dbInstance = {
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(mockUser),
    };
    connectToDB.mockResolvedValue(dbInstance);

    const response = await request(app).post('/reset-password').send(mockUser);
    expect(response.status).toBe(200);
  });
});