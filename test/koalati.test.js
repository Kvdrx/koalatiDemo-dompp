/*
    A lineage library for DOM nodes
    MIT License
  
    Copyright (c) 2020-2021 Abdoul Kader Kassa, Florent Dumoulin, Sylvain Hallé
    Eckinox Média and Université du Québec à Chicoutimi
  
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
  
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
  
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

/**
 * Imports
 */
// Chai for assertions
import pkg_chai from "chai";
const { expect, timeout } = pkg_chai;

// JSDOM for DOM trees
import pkg_jsdom from "jsdom";
const { JSDOM } = pkg_jsdom;
import "jsdom-global";

// DataTree for tree management
import pkg_datatree from "data-tree";
const { dataTree } = pkg_datatree;

// Utilities
import { load_file_in_puppeteer} from "./test-util.mjs";

//  Get tree from witness
import {
    ComposedFunction,
    CompoundDesignator,
    DimensionHeight,
    DesignatedObject,
    DimensionWidth,
    Equals,
    Exists,
    Explainer,
    Find,
    ForAll,
    GreaterOrEqual,
    GreaterThan,
    IsGreaterOrEqual,
    IsGreaterThan,
    IsLessOrEqual,
    IsLessThan,
    LesserOrEqual,
    MarginBottom,
    MarginTop,
    TestCondition,
    Verdict,
    Width,
    Zindex,
} from "../index.mjs";

// /////////// Extra imports for the reading of css files//////////////////////////////////
import * as fs from 'fs'
import * as path from 'path'
const __dirname = path.dirname(new URL(
    import.meta.url).pathname);
// /////////// End Extra ///////////////////
//import * as assert from 'assert';
let koalatiPage;
let koalatiPricingPage;
let koalatiloadingspeedPage;
koalatiPage = await load_file_in_puppeteer("./test/Koalati/index.html");
koalatiPricingPage = await load_file_in_puppeteer("./test/Koalati/pricing.html");
koalatiloadingspeedPage =await load_file_in_puppeteer("./test/Koalati/features/loading-speed.html");

describe("Checking for bugs on Koalati website index page", () => {

    const dom = fs.readFileSync('./test/Koalati/index.html', 'utf-8')
    const url = 'file://${__dirname}/koalati/index.html'
    const { window } = new JSDOM(dom, { resources: 'usable', url: url })
    const { document } = window

    function delay(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve,time);
        });
    }
    
   async function assertDomppCondition(cond, page, selector)
    {       
        const result = await page.evaluate(function () {
            let body = document.querySelector(selector);
            let result = cond.evaluate(body);
            const passed = result.getValue();

            if (expect(passed).to.equal(false)){
            return result.getStaticExplanation();
            }
            
        }  
    )}


     it("Texts from different paragraphs overlap", async() => {

        await koalatiPage.setViewport({ width: 280, height: 653 });
        await koalatiPage.evaluate(function() { window.scroll(0,330); });
		const result = await koalatiPage.evaluate(function() {

			let body = document.querySelector("body");
			let f = dompp.Exists(
				"$x",
				new dompp.Find(".container"),
				dompp.Exists(
					"$y",
					dompp.Find(".testimonial-source"),
					dompp.IsGreaterOrEqual(
						new dompp.ComposedFunction(new dompp.Zindex(), "$x"),
						new dompp.ComposedFunction(new dompp.Zindex(), "$y")
					)
                    
				)

			)
			let cond = new dompp.TestCondition(" text container Zindex >= testimonial-source Zindex", f);
            window.scroll(0,0);

			return cond;
           
        })
        
        assertDomppCondition(cond,koalatiPage,"body");
		
            
})

async function assertDomppCondition(cond, page, selector)
    {       
        const result = await page.evaluate(function () {
            let body = document.querySelector(selector);
            let result = cond.evaluate(body);
            const passed = result.getValue();

            if (expect(passed).to.equal(false)){
            return result.getStaticExplanation();
            }
            
        }  
    )}



  
    it("tone on tone bug after scrolling the page", async() => {

		const result = await koalatiPage.evaluate(function() {

			let body = document.querySelector("body");
            let f = dompp.Exists(
				"$x",
				dompp.Find(".header-navigation"),
					dompp.Exists(
                        "$y",
                        dompp.Find(".branding-logo"),
                        dompp.Not(
						new dompp.Equals(
							new dompp.ComposedFunction(new dompp.BackgroundColor(),"$x"),
							new dompp.ComposedFunction(new dompp.Color(),"$y")
						)
					)
				)
            )
			let cond = new dompp.TestCondition(".hearder-navigation backgroundColor != .header-navigation color", f);
			let result = cond.evaluate(body).getValue();
		    return result;
		});

		expect(result).to.equal(true);
        
    })




    it("The different elements of the navigation bar are always aligned horizontally", async() => {


		const result = await koalatiPage.evaluate(function() {
    
                let body = document.querySelector("body");
                let f = dompp.Exists(
                    "$x",
                    dompp.Find(".main-navigation"),
                    dompp.Exists(
                        "$y",dompp.Find(".main-navigation"),
                        dompp.Equals(
                            new dompp.ComposedFunction(new dompp.MarginTop(), "$x"),
                            new dompp.ComposedFunction(new dompp.MarginTop(), "$y")
                        )
                    )
    
                )
                let cond = new dompp.TestCondition("Elements on .main-navigation is in top", f);
                let result = cond.evaluate(body).getValue();
    
                return result;
            
		});
		expect(result).to.equal(true);
        
    });

    it("The content of the page is larger than the screen window in RWD ", async() => {

        await koalatiPage.setViewport({ width: 280, height: 653 });
        await koalatiPage.evaluate(function() { window.scroll(285,0); });
		await delay(1000)
		const result = await koalatiPage.evaluate(function() {

			let body = document.querySelector("body");

			let f = dompp.Equals(
				new dompp.DimensionWidth("$x"),
                body.scrollWidth
			)
			let cond = new dompp.TestCondition("body width = body scrollwidth", f);
			let result = cond.evaluate(body).getValue();
			return result;
		});
        
		expect(result).to.equal(false);

})

    it("There should never be an horizontal scrollbar in RWD", async() => {

        await koalatiPage.setViewport({ width: 280, height: 653 });
        await koalatiPage.evaluate(function() { window.scroll(285,0); });
		await delay(1000)
		const result = await koalatiPage.evaluate(function() {

			let body = document.querySelector("body");

			let f = new dompp.Not(dompp.IsLessThan(
                new dompp.ComposedFunction(new dompp.DimensionWidth(), "$x"),body.scrollWidth
            )
            )
			let cond = new dompp.TestCondition("body width < body scrollwidth", f);
			let result = cond.evaluate(body).getValue();
			return result;
		});
		expect(result).to.equal(true);
    })    

    it("Enlargement of elements of the navigation bar", async() => {


		const result = await koalatiPage.evaluate(function() {

			let body = document.querySelector("body");
    
            let f = dompp.ForAll(
                "$x",
                dompp.Find(".main-navigation"),
                dompp.ForAll(
                    "$y",
                    dompp.Find(".main-navigation"),
                    dompp.And(
                    new dompp.Equals(
                        new dompp.ComposedFunction(new dompp.DimensionWidth(), "$x"),
                        new dompp.ComposedFunction(new dompp.DimensionWidth(), "$y")
                    ),
                    new dompp.Equals(
                        new dompp.ComposedFunction(new dompp.DimensionHeight(), "$x"),
                        new dompp.ComposedFunction(new dompp.DimensionHeight(), "$y")
                    )       
                )
            )
        )
			let cond = new dompp.TestCondition(" The element of the navigation bar are at the same position", f);
			let result = cond.evaluate(body).getValue();

			return result;
		});

		expect(result).to.equal(true);
    })
    

    it("The text is not the same color as the body background", async() => {

        const result = await koalatiPage.evaluate(function() {

			let body = document.querySelector("body");

            let f = dompp.Exists(
                "$x",
                dompp.Find(".text-block"),
                dompp.Exists(
                    "$x",dompp.Find(".homepage-body"),
                    new dompp.Equals(
                        new dompp.ComposedFunction(new dompp.Color(), "$x"),
                        new dompp.ComposedFunction(new dompp.BackgroundColor(),"$x")     
                )
            )
        )
			let cond = new dompp.TestCondition(".body textColor == body BackgroundColor", f);
			let result = cond.evaluate(body).getValue();
			return result;
		
        })
		expect(result).to.equal(false);        
    })


});

describe("Checking for bugs on Koalati website pricing page ", () => {

    const dom = fs.readFileSync('./test/Koalati/pricing.html', 'utf-8')
    const url = 'file://${__dirname}/koalati/pricing.html'
    const { window } = new JSDOM(dom, { resources: 'usable', url: url })
    const { document } = window

    function delay(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve,time);
        });
    }

   
    it("All the text in the frame is not displayed in RWD", async() => {

        await koalatiPage.setViewport({ width: 280, height: 653 });
        await koalatiPage.evaluate(function() { window.scroll(280,653); });
		await delay(1000)
		const result = await koalatiPricingPage.evaluate(function() {
        
			let body = document.querySelector("body");
			let f = dompp.Exists(
				"$x",
				dompp.Find(".accordion-item.open .accordion-toggle + *"),
				dompp.Exists(
					"$y",
					dompp.Find(".faq-item-answer"),
					dompp.IsLessThan(
					    new dompp.ComposedFunction(new dompp.DimensionHeight(), "$x"),
						new dompp.ComposedFunction(new dompp.DimensionHeight(), "$y")
					)
                    
				)

			)

			let cond = new dompp.TestCondition(" accordion-item.open .accordion-toggle + * height < faq-item-answer heigt", f);
			let result = cond.evaluate(body).getValue();

            
			return result;

		});

		expect(result).to.equal(true);
ç    })   



/*
    describe("Checking for bugs on Koalati website pricing page ", () => {

        const dom = fs.readFileSync('./test/Koalati/features/loading-speed.html', 'utf-8')
        const url = 'file://${__dirname}/koalati/features/loading-speed.html'
        const { window } = new JSDOM(dom, { resources: 'usable', url: url })
        const { document } = window
    
        function delay(time) {
            return new Promise(function(resolve) {
                setTimeout(resolve,time);
            });
        }
    
       
        it("Fake Loading ", async() => {
    
            await delay(1000)
            const result = await koalatiloadingspeedPage.evaluate(function() {
            
                let body = document.querySelector("body");
                let animationD = document.querySelector("body").style.animation; 
                let animationDuration = parseInt(animationD);
                let f = dompp.Exists(
                    "$x",
                    dompp.Find(".page-wrapper"),
                        new dompp.IsGreaterOrEqual(
                           animationDuration,9)
                )
                let cond = new dompp.TestCondition(" Fake loading is available", f);
                let result = cond.evaluate(body).getValue();
    
                return result;
            });
    
            expect(result).to.equal(true);
        }) */  
});


