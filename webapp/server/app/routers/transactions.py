from fastapi import APIRouter
from pydantic import BaseModel, Field
import pickle
import os
import numpy as np

CLASSES = {"0": "LEGIT", "1": "FRAUD"}
TYPES1 = ("cash_in", "cash_out", "debit", "payment", "transfer")
TYPES2 = ("cc", "cm")

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
    responses={}
)

with open(f"{os.getcwd()}/ml/xgb.pkl", "rb") as file:
    model = pickle.load(file)

class Transaction(BaseModel):
    step: int = 0
    amount: float = 0
    oldBalanceOrg: float = 0
    newBalanceOrig: float = 0
    oldbalanceDest: float = 0
    newbalanceDest: float = 0
    type1: str = TYPES1[0]
    type2: str = TYPES2[0]

@router.post("/validate", description="Endpoint for validating the online transactions with given details. Returns final verdict and probas of performed prediction for each class of fraudness (0 - legit, 1 - fraud).")
async def validate_transaction(transaction: Transaction):
    data = dict(transaction)
    model_input = [value for key, value in data.items() if key not in ["type1", "type2"]]
    model_input.extend([int(data["type1"].lower() == x) for x in TYPES1])
    model_input.extend([int(data["type2"].lower() == x) for x in TYPES2])

    model_input = np.array(model_input).reshape((1, -1))
    prediction = model.predict_proba(model_input)[0].tolist()
    prediction_results = {"0": prediction[0], "1": prediction[1]}

    return {"msg": f"Entered transaction is {CLASSES[max(prediction_results, key=prediction_results.get)]}.", "input_data": model_input[0].tolist(), "prediction_results": prediction_results}