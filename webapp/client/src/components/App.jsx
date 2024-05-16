import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Form, Button, Container } from 'solid-bootstrap';
import './App.css';
import { validateTransaction } from '../api/transactions';

function App() {
  const [transaction, setTransaction] = createStore({
    step: 0,
    amount: 0.0,
    oldBalanceOrg: 0.0,
    newBalanceOrig: 0.0,
    oldbalanceDest: 0.0,
    newbalanceDest: 0.0,
    type1: "cash_in",
    type2: "cc"
  });

  const [isLoading, setIsLoading] = createSignal(false);
  const [data, setData] = createSignal(null);

  const handleInput = (e) => {
    e.preventDefault();
    setTransaction({
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    validateTransaction(transaction)
      .then((result) => {
        setData(result);
        console.log(data());
        setIsLoading(false);
      });
    return false;
  };

  return (
    <Container class='content-wrapper' fluid>
      {data() ? <p>This transaction is fraudulent with a {data().prediction_results["1"].toFixed(3)}% probability.</p> : null}
      <Form class='transaction-form' onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Step</Form.Label>
          <Form.Control 
            onInput={handleInput} 
            required 
            disabled={isLoading()}
            placeholder='Enter timestamp (in hour units)' 
            name='step' 
            type='number' 
            size='sm'/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control 
            onInput={handleInput}
            required 
            disabled={isLoading()}
            placeholder='Enter amount of transaction'
            name='amount'
            type='number' 
            size='sm' />
        </Form.Group>

        <Form.Group>
          <Form.Label>Old Balance Origin</Form.Label>
          <Form.Control 
            onInput={handleInput} 
            required 
            disabled={isLoading()}
            placeholder='Enter sender balance origin amount'
            name='oldBalanceOrg' 
            type='number' 
            size='sm' />
        </Form.Group>

        <Form.Group>
          <Form.Label>New Balance Origin</Form.Label>
          <Form.Control 
            onInput={handleInput} 
            required 
            disabled={isLoading()}
            placeholder='Enter receiver balance origin amount' 
            name='newBalanceOrig'
            type='number' 
            size='sm' />
        </Form.Group>

        <Form.Group>
          <Form.Label>Old Balance Destination</Form.Label>
          <Form.Control 
            onInput={handleInput} 
            required 
            disabled={isLoading()}
            placeholder='Enter sender balance destination amount' 
            name='oldbalanceDest'
            type='number' 
            size='sm' />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>New Balance Destination</Form.Label>
          <Form.Control 
            onInput={handleInput} 
            required 
            disabled={isLoading()}
            placeholder='Enter receiver balance destination amount' 
            name='newbalanceDest'
            type='number' 
            size='sm' />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Type1</Form.Label>
          <Form.Select onInput={handleInput} required disabled={isLoading()} name='type1' size="sm">
            <option value="">Choose type1 of transaction</option>
            <option value="cash_in">CASH IN</option>
            <option value="cash_out">CASH OUT</option>
            <option value="debit">DEBIT</option>
            <option value="payment">PAYMENT</option>
            <option value="transfer">TRANSFER</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Type2</Form.Label>
          <Form.Select onInput={handleInput} required disabled={isLoading()} name='type2' size="sm">
            <option value="">Choose type2 of transaction</option>
            <option value="cc">Customer - Customer</option>
            <option value="cm">Customer - Merchant</option>
          </Form.Select>
        </Form.Group>

        <Button class='submit-btn' variant='primary' type='submit'>Validate</Button>
      </Form>
    </Container>
  )
}

export default App
