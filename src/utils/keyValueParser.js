class parseGatewayResponse {
    constructor(string) {
        this.response = string;
    }
    parse(string) {
        let key;
        let value;
        let responseObject = {};
        do {
            // Get the parameter (Until equal sign) and delete
            key = this.response.substring(0, this.response.indexOf("="));
            this.response = this.response.replace(key + "=", "");
            // Get the value
            if (this.response.includes("&")) {
                value = this.response.substring(0, this.response.indexOf("&"));
            } else {
                value = this.response.substring(0, this.response.length);
            }
            // Add to object
            if (key) {
                responseObject[key] = value;
                this.response = this.response.replace(value + "&", "");
            }
        } while (this.response.length >= 0 && key);

        return responseObject;
    }
}

module.exports = parseGatewayResponse;




