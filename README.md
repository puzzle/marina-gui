# Marina GUI

This is the web GUI of the application with the code name 'Marina'.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Basic Workflow
1) Users login to the Application for the first time. He sees basically an empty dashboard and not much else.
2) Now that the login has triggered a user creation within the Marina App, the user can hit up the HR department to create his *User Agreement*. HR now sees the "new" employee within the Marina App, under the Tab *Employees*.
3) HR uploads the User Agreement to the Marina App
4) The User logs in again and can now see more possible actions information.
5) Under *User Settings*, the user adds his Bitcoin Address and defines what percentage of his salary he'd like to receive in Bitcoin. He may only do from the 26th. of the month until the 10th of the next month. Afterwards this setting is blocked for accounting reasons.
6) On payday, the buys Bitcoin from an exchange (outside Marina!), and sends it to it's own wallet (outside Marina!). To figure out *how much* Bitcoin he has to buy, he looks up the *Total* on the bottom of the page *Employees*, and then **buys a little bit more than that** (he'll need to pay Bitcoin transaction fees when sending the money to the employees).
7) Once the CFO has received the Bitcoin, he exports the Private Key from his wallet and enters it into the Marina App, under the tab *Payment*. After entering the Private Key, the *Output* that contains the money is displayed. The CFO also enters the exchange rate that he received from the exchange.
8) The CFO goes to his own wallet and hits the receive button to get a new Bitcoin address. He then enters that address to the field *Address for remaining amount (change output)*.
9) The CFO then figures out how much transaction fee he is going to include for the Bitcoin transaction to go through within the next couple hours. Sites like https://mempool.space/ are helpful for this task. From the dropdown, in he selects what transaction fee rate he'd like to pay.
10) The CFO sends the payment. He can check the status of the transacton on blockstream.info, by searching for the change address he entered into marina in step 8. Users can also check the transaction status on blockstream.info, by searching for their payout address.

## Troubleshooting

### No outputs shown
Sometimes the output that the CFO wants to spend doesn't show up after adding the private key to the Marina App. This is most likely an issue with the API, where Marina pulls the data from (3rd party service). Maybe just try again a couple of hours later.

### Salary sent but not visible in the Marina App
If the employees received their money, but the salary payment doesn't show up within the Marina App, have a look at [this issue](https://github.com/puzzle/marina-backend/issues/12).

### Export private key from Bitcoin Core
1) In Bitcoin Core, open the console:  "Window"->"Console"
2) Enter the command `walletpassphrase <your_password> 120`.
3) Enter the command `dumpprivkey <Bitcoin Address that contains the money>` 
4) The output you see is the private key. **Caution! Anyone who knows this key can spend/steal the Bitcoin on the corresponding address!**

### Manually change monthly paymount amount, after settings are locked for user
First, here are some information that should help you understand what you're dealing with:
* The percentage is not being saved anywhere in the database. Instead, the nominal amount that shall be paid out as the Bitcoin salary is stored in the table `current_configuration`.
* When the admin changes a salary within the locking period, the payment amount is being set to 0. [This is bad](https://github.com/puzzle/marina-backend/issues/14). Given the point mentioned before, this also makes it impossible for you to find out what percentage the user wanted initially. You'll have to figure that out by looking at the users history, or even better, by asking him what setting he'd like to have.

##### Step-by-step guide
1) Get onto the database machine/pod . Run `psql` to switch into a Postgres context and then `\c marina` to connect to the right database.
2) Search for the employee you want to change: `SELECT * FROM employee;` -> write down `id` and `brutto_salary`;
3) Calculate what nominal amount you want the user to receive for this month using the `brutto_salary` and the percentage you found out the user wants to receive in Bitcoin. For example: `316.35`
4) Write the result into the table `current_configuration`: `UPDATE current_configuration SET amount_chf = <nominal value in USD/EUR/CHF> WHERE employee_id = <employee id>;`
5) In the Marina GUI look at the page `Payment` and check that everything is as expected.
