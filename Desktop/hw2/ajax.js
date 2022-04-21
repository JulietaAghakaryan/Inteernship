class CustomPromise {
    constructor(func) {
      this.promiseChaining = [];
      this.handleError = () => {};
  
      this.onResolve = this.onResolve.bind(this);
      this.onReject = this.onReject.bind(this);
  
      func(this.onResolve, this.onReject);
    }
  
    then(handleSuccess) {
      this.promiseChaining.push(handleSuccess);
  
      return this;
    }
  
    catch(handleError) {
      this.handleError = handleError;
  
      return this;
    }
  
    onResolve(value) {
      let storedValue = value;
      try {
        this.promiseChaining.forEach((next) => {
          storedValue = next(storedValue);
        });
      } catch (error) {
        this.promiseChaining = [];
  
        this.onReject(error);
      }
    }
  
    onReject(error) {
      this.handleError(error);
    }
  }



  let ajax = function(url, config){
    return new CustomPromise(function (onResolve, onReject) {
        let xhr = new XMLHttpRequest();
        xhr.open(config.type, url);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
				onResolve(xhr.response);
			} else {
				onReject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			}
        };
        xhr.onerror = function () {
          onReject(xhr.statusText);
        };
		
        xhr.send();
      });
    }
  
    ajax('https://catfact.ninja/fact', {
            type: "GET",
             headers: {},
             data: {}
       })
       .then((result) => {
        console.log('Success', result);
      })
      .catch( (err) => {
        console.log('There is an error', err);
      });