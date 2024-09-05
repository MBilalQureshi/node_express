const views = {
    list({guitars}){
        const liElements = guitars.map(({id, make, model})=>
            `<li><a href="/guitars/${id}">${make} ${model}</a></li>`
        );
        return this._layout(`
            <ul>
                ${liElements.join('')}
            </ul>
        `);
    },
    _layout(content){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Guitars</title>
        </head>
        <body>
            ${content}
        </body>
        </html>`;
    }
}

// The view function uses the name parameter to look up the corresponding method in the views object and then calls that 
// method with the data parameter. The result of this method call is returned by the view function.
export const view = (name,data) => views[name](data);