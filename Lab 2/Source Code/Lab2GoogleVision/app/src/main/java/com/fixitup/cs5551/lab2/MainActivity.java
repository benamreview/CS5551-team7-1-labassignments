package com.fixitup.cs5551.lab2;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
/*For login activity, we take advantage of the cloud database and services from Firebase because it has been
straightforward to implement authentication and database verification within Firebase.

 For authentication, we enabled email/password authentication only, which will be validated against
 the Firebase authentication feature, and also added to the database under User column if applicable.

 Upon signing in successfully, we will direct the user to a new activity named HomeActivity
 where the main logic of the application exists: Taking Pictures from Camera/Photo Gallery
  and analyze it with Google Vision API for Android.

 */
public class MainActivity extends AppCompatActivity {
    private EditText mEmail, mPassword;
    private Button mLogin, mRegistration;
    String user_id;
    private FirebaseAuth mAuth;
    private FirebaseAuth.AuthStateListener firebaseAuthListener;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mAuth = FirebaseAuth.getInstance();
        firebaseAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser(); //get the information of the current user
                if (user != null){
                    //if not null, move to another activity, to be created later.
                    //Remember the current context!
                    Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                    intent.putExtra("user_id", user.getUid());
                    intent.putExtra("user_email", user.getEmail());
                    startActivity(intent);
                    finish();
                    return;
                }
            }
        };

        //Initialize variables from xml UI layout.
        mEmail = (EditText) findViewById(R.id.email);
        mPassword = (EditText) findViewById(R.id.password);
        mLogin = (Button) findViewById(R.id.login);
        mRegistration = (Button) findViewById(R.id.registration);

        mRegistration.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View v) {
                final String email = mEmail.getText().toString();
                final String password = mPassword.getText().toString();
                mAuth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(MainActivity.this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        //If user has already signed up, therefore the createUserWithEmailandPassword would fail.
                        if (!task.isSuccessful()){
                            Toast.makeText(MainActivity.this, "Registration Failed!", Toast.LENGTH_SHORT).show();
                        }
                        //If the user email cannot be found in the database, reference the database and add variables to it.
                        else {
                            user_id = mAuth.getCurrentUser().getUid(); //id assigned to Technician at moment of sign-up
                            //this database reference is pointing to the technicians
                            DatabaseReference current_user_db = FirebaseDatabase.getInstance().getReference().child("Users").child(user_id);
                            current_user_db.setValue(true);
                            current_user_db = FirebaseDatabase.getInstance().getReference().child("Users")
                                    .child(user_id).child("email");
                            current_user_db.setValue(email);
                        }
                    }
                });
            }
        });
        mLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String email = mEmail.getText().toString();
                final String password = mPassword.getText().toString();
                mAuth.signInWithEmailAndPassword(email, password).addOnCompleteListener(MainActivity.this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (!task.isSuccessful()){
                            Toast.makeText(MainActivity.this, "Authentication Failed!", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        mAuth.addAuthStateListener(firebaseAuthListener);
    }

    @Override
    protected void onStop() {
        super.onStop();
        mAuth.removeAuthStateListener(firebaseAuthListener);
    }
}
