# 🚀 Sandpack IDE Setup Guide

This guide will walk you through setting up the Python Sandpack Project in Sandpack IDE, the cloud-based development environment.

## 🌟 What is Sandpack?

**Sandpack** is a cloud-based development environment that provides:
- **Cloud-based coding**: Access your projects from anywhere
- **Sandboxed environment**: Safe, isolated development space
- **Real-time collaboration**: Work with team members simultaneously
- **Multiple frameworks**: Support for Python, React, Vue, and more
- **Instant deployment**: Deploy your projects with one click
- **No setup required**: Everything runs in the browser

## 🎯 Why Use Sandpack for Python Development?

### ✅ Advantages
- **No local setup**: Skip Python installation and environment configuration
- **Cross-platform**: Works on any device with a web browser
- **Collaborative**: Share your development environment with others
- **Version control**: Integrated Git support
- **Package management**: Easy dependency installation
- **Instant sharing**: Share your running application with a URL

### 🚀 Perfect for
- **Learning Python**: No setup barriers
- **Prototyping**: Quick idea validation
- **Collaboration**: Team development and code reviews
- **Presentations**: Live coding demonstrations
- **Remote work**: Access from any location

## 📋 Prerequisites

- **Web browser**: Chrome, Firefox, Safari, or Edge
- **Internet connection**: Stable internet for cloud development
- **GitHub account**: Optional, for version control integration

## 🚀 Step-by-Step Setup

### Step 1: Access Sandpack IDE

1. **Open your browser** and navigate to:
   ```
   https://sandpack.codesandbox.io
   ```

2. **Choose Python template**:
   - Look for the "Python" template
   - Click on it to create a new Python environment

### Step 2: Import Project Structure

1. **Create the project structure**:
   - In the file explorer, create the following folders:
     - `src/`
     - `src/models/`
     - `src/services/`
     - `src/utils/`
     - `src/config/`
     - `tests/`
     - `examples/`
     - `docs/`

2. **Copy project files**:
   - Copy all the Python files from this project into their respective folders
   - Ensure the file structure matches exactly

### Step 3: Install Dependencies

1. **Open the terminal** in Sandpack:
   - Look for the terminal tab at the bottom
   - Click to open it

2. **Install requirements**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify installation**:
   ```bash
   python --version
   pip list
   ```

### Step 4: Run the Application

1. **Start the application**:
   ```bash
   python src/main.py
   ```

2. **Access your app**:
   - Sandpack will provide a URL for your running application
   - Click on the URL to open your app in a new tab
   - The default URL format is: `https://[random-id].sandpack.codesandbox.io`

3. **Test the endpoints**:
   - **Home**: `/` - Welcome message
   - **Health**: `/health` - Health check
   - **Info**: `/info` - Project information
   - **Docs**: `/docs` - Interactive API documentation

## 🔧 Configuration Options

### Environment Variables

You can set environment variables in Sandpack:

1. **Create a `.env` file** in your project root:
   ```env
   ENVIRONMENT=development
   DEBUG=true
   LOG_LEVEL=INFO
   ```

2. **Or set them in the terminal**:
   ```bash
   export ENVIRONMENT=development
   export DEBUG=true
   ```

### Custom Ports

By default, the app runs on port 8000. To change this:

1. **Modify `src/main.py`**:
   ```python
   uvicorn.run(
       app,
       host="0.0.0.0",
       port=3000,  # Change this line
       log_level="info",
       reload=True
   )
   ```

2. **Or set environment variable**:
   ```bash
   export PORT=3000
   ```

## 🧪 Running Tests

### Execute Test Suite

1. **Run all tests**:
   ```bash
   pytest
   ```

2. **Run with coverage**:
   ```bash
   pytest --cov=src
   ```

3. **Run specific tests**:
   ```bash
   pytest tests/test_main.py
   ```

### Test Output

Tests will run in the terminal and show:
- ✅ Passed tests
- ❌ Failed tests
- 📊 Coverage report
- ⏱️ Execution time

## 📱 Using the Examples

### Run Basic Examples

1. **Navigate to examples directory**:
   ```bash
   cd examples
   ```

2. **Run the basic usage example**:
   ```bash
   python basic_usage.py
   ```

3. **View the output** in the terminal

### Example Features Demonstrated

- User creation and management
- Data validation
- Error handling
- Utility functions
- Service layer operations

## 🔍 Troubleshooting

### Common Issues

#### 1. **Import Errors**
**Problem**: Module not found errors
**Solution**: Ensure all `__init__.py` files are present in package directories

#### 2. **Port Already in Use**
**Problem**: Port 8000 is already occupied
**Solution**: Change the port in `src/main.py` or kill existing processes

#### 3. **Dependencies Not Found**
**Problem**: Package installation failures
**Solution**: Check internet connection and try:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

#### 4. **Permission Errors**
**Problem**: File permission issues
**Solution**: In Sandpack, this is usually not an issue, but check file ownership

### Getting Help

1. **Check the logs** in the terminal
2. **Review the documentation** in the `docs/` folder
3. **Run tests** to identify specific issues
4. **Check Sandpack status** at their official site

## 🚀 Advanced Features

### Git Integration

1. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Connect to GitHub**:
   - Create a new repository on GitHub
   - Follow the connection instructions in Sandpack

### Custom Domains

1. **Deploy your app** using Sandpack's deployment feature
2. **Set custom domain** in the deployment settings
3. **Configure DNS** to point to your Sandpack deployment

### Environment Management

1. **Create multiple environments**:
   - Development
   - Staging
   - Production

2. **Use different configuration files** for each environment

## 📊 Monitoring and Debugging

### Application Logs

1. **View logs** in the terminal where you started the app
2. **Set log level** via environment variable:
   ```bash
   export LOG_LEVEL=DEBUG
   ```

### Health Checks

1. **Monitor application health**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check response times** and status

### Performance Monitoring

1. **Use FastAPI's built-in monitoring**
2. **Check endpoint response times** in the `/docs` interface
3. **Monitor memory usage** in Sandpack's resource panel

## 🔒 Security Considerations

### Development Environment

- **Sandboxed**: Sandpack provides isolation
- **No persistent storage**: Data is not permanently stored
- **Temporary sessions**: Sessions expire after inactivity

### Production Deployment

- **Change default secrets** in production
- **Use environment variables** for sensitive data
- **Enable HTTPS** in production deployments

## 🎉 Next Steps

### What You Can Do Now

1. **Explore the API** at `/docs`
2. **Run the examples** in the `examples/` folder
3. **Add new endpoints** to the FastAPI application
4. **Create new models** in the `src/models/` directory
5. **Write tests** for new functionality

### Learning Resources

- **FastAPI Tutorial**: https://fastapi.tiangolo.com/tutorial/
- **Pydantic Documentation**: https://pydantic-docs.helpmanual.io/
- **Python Async**: https://docs.python.org/3/library/asyncio.html
- **Sandpack Documentation**: Check their official documentation

### Project Expansion Ideas

- **Add database integration** with SQLAlchemy
- **Implement user authentication** with JWT
- **Create a frontend** with HTML/CSS/JavaScript
- **Add file upload functionality**
- **Integrate with external APIs**

## 🏁 Conclusion

Congratulations! You've successfully set up the Python Sandpack Project in Sandpack IDE. You now have:

- ✅ A fully functional Python web application
- ✅ Modern FastAPI backend with Pydantic models
- ✅ Comprehensive testing suite
- ✅ Beautiful documentation
- ✅ Cloud-based development environment

**Happy coding in the cloud! 🚀☁️**

---

*For additional support or questions, refer to the main documentation in the `docs/` folder or visit the project repository.*