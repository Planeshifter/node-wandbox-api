#include <iostream>
#include <vector>
#include <boost/math/special_functions/gamma.hpp>

using namespace std;

vector<double> linspace( double start, double end, int num ) {
	double delta = (end - start) / (num - 1);
	vector<double> arr( num );
	for ( int i = 0; i < num; ++i ){
		arr[ i ] = start + delta * i;
	}
	arr.push_back( end );
	return arr;
}

void print_vector( vector<double> vec, bool last = false ) {
	cout << "[";
	for ( vector<double>::iterator it = vec.begin(); it != vec.end() - 1; it++ ) {
		cout << setprecision (16) << *it << ", ";
	}
	cout << setprecision (16) << *vec.end();
	cout << "]";
	if ( last == false ) {
		cout << ",";
	}
	cout << endl;
	return;
}

void print_results( vector<double> data, vector<double> expected ) {
	cout << "{" << endl;
	cout << "  \"x\": ";
	print_vector( data );
	cout << "  \"expected\": ";
	print_vector( expected, true );
	cout << "}" << endl;
	return;
}

int main() {
	vector<double> x = linspace( 1.0, 10.0, 100 );
	vector<double> expected;

	for ( double value: x ) {
		expected.push_back( boost::math::tgamma( value ) );
	}

	print_results( x, expected );
	return 0;
}
