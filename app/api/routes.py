from flask import Blueprint, request, jsonify, render_template
from helpers import token_required
from models import db, User, Inventory, inventory_schema, inventorys_schema

api = Blueprint('api',__name__, url_prefix='/api')


@api.route('/inventory', methods = ['POST'])
@token_required
def create_car(current_user_token):
    year = request.json['year']
    make = request.json['make']
    model = request.json['model']
    color = request.json['color']
    user_token = current_user_token.token

    print(f'BIG TESTER: {current_user_token.token}')

    car = Inventory(year, make, model, color, user_token=user_token)

    db.session.add(car)
    db.session.commit()

    response = inventory_schema.dump(car)
    return jsonify(response)

@api.route('/inventory', methods = ['GET'])
@token_required
def get_cars(current_user_token):
    a_user = current_user_token.token
    cars = Inventory.query.filter_by(user_token = a_user).all()
    response = inventorys_schema.dump(cars)
    return jsonify(response)

@api.route('/inventory/<id>', methods = ['GET'])
@token_required
def get_single_contact(current_user_token, id):
    car = Inventory.query.get(id)
    response = inventory_schema.dump(car)
    return jsonify(response)


@api.route('/inventory/<id>', methods = ['POST', 'PUT'])
@token_required
def update_car(current_user_token, id):
    car = Inventory.query.get(id)
    car.year = request.json['year']
    car.make = request.json['make']
    car.model = request.json['model']
    car.color = request.json['color']
    car.user_token = current_user_token.token

    db.session.commit()
    response = inventory_schema.dump(car)
    return jsonify(response)

@api.route('/inventory/<id>', methods = ['DELETE'])
@token_required
def delete_car(current_user_token, id):
    car = Inventory.query.get(id)
    db.session.delete(car)
    db.session.commit()
    response = inventory_schema.dump(car)
    return jsonify(response)
    