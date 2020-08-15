function trimValue(value) {
    return value ? value.trim() : value
}

function isBlank(value) {
    return trimValue(value) ? false : true
}

function isMaxChar(value, maxChar) {
    if(!value) {
        return false
    } else {
        return value.length <= maxChar ? true : false
    }
}

function isMinChar(value, minChar) {
    if(!(value)) {
        return false
    } else {
        return value.length >= minChar ? true : false
    }
}

function inputNameHandler(value) {  
    return { isBlank: isBlank(value), 
        isMax20Char: isMaxChar(value, 20)}
}

function inputPwdHandler(value) {
    return {
        isBlank: isBlank(value),
        isMin8Char: isMinChar(value, 8)
    }
}

function checkPwd(value, checkValue) {
    return value == checkValue ? true : false
}

function inputHandler(event) {
    const target = event.target
    const { name, value } = target
    this.setState({
        [name] : trimValue(value)
    })
}

function  checkMatchPwd(value, valueId, checkValue, checkValueId, styleError) {
    let isEqual = value === checkValue ? true : false
    let { inputStyle } = this.state
    let error = inputStyle + styleError
    let result = false

    if(!isEqual) {
        this[checkValueId].className = error
        this[checkValueId].value = ''
        this[checkValueId].placeholder = 'Does not match'
    } else {
        result = true
    }

    return result
}


function validatePwd(value, inputId, styleError) {
    let { isBlank, isMin8Char } = inputPwdHandler(value)
    let { inputStyle } = this.state
    let error = inputStyle + styleError
    let result = false

    if(isBlank) {
        this[inputId].value = ''
        this[inputId].className = error
    } else if(!isMin8Char) {
        this[inputId].value = ''
        this[inputId].placeholder = "At least 8 characters"
        this[inputId].className = error
    } else {
        this[inputId].className = inputStyle
        result = true
    }

    return result
}

function validateName(value, inputId, styleError) {
    let { isBlank, isMax20Char } = inputNameHandler(value)
    let { inputStyle } = this.state
    let error = inputStyle + styleError
    let result = false

        if(isBlank) {
            this[inputId].value = ''
            this[inputId].placeholder = 'Name (Maximum 20 characters)'
            this[inputId].className = error
        } else if(!isMax20Char) {
            this[inputId].value = ''
            this[inputId].className = error
            this[inputId].placeholder = "Can't be over 20 characters"
        } else {
            this[inputId].className = inputStyle
            result = true
        }
    return result
}

function validateEmail(value, inputId, styleError) {
    let { isBlank } = inputNameHandler(value)
    let { inputStyle } = this.state
    let error = inputStyle + styleError
    let result = false
    const regExp = RegExp(
        /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
    )

        if(isBlank) {
            this[inputId].value = ''
            this[inputId].className = error 
        } else if(!regExp.test(value)) {
            this[inputId].value = ''
            this[inputId].placeholder = "Invalid email address"
            this[inputId].className = error 
        }
        else {
            this[inputId].className = inputStyle
            result = true
        }
    return result
}

function validateBlank(value, inputId) {
    let { isBlank, isMax20Char } = inputNameHandler(value)
    let { inputStyle } = this.state
    let result = false

        if(isBlank) {
            this[inputId].value = ''
            this[inputId].placeholder = this[inputId].placeholder
        } else {
            result = true
        }
    return result
}

export {
    inputNameHandler,
    inputPwdHandler,
    inputHandler,
    checkPwd,
    trimValue,
    checkMatchPwd,
    validatePwd,
    validateName,
    validateEmail,
    validateBlank
}