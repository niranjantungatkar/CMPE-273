package CalService;

import javax.jws.WebService;




@WebService
public class EvalExp {
	
	
	public String evalExp(float op1, float op2, String operator)
	{
		
		String answer = "";
		switch (operator) 
		{
        	case "+":  
        		answer = Float.toString((op1 + op2));
        		break;
        	case "*":  
        		answer = Float.toString((op1 * op2));
        		break;
        	case "/":  
        		answer = Float.toString((op1 / op2));
        		break;
        	case "-": 
        		answer = Float.toString((op1 - op2));
        		break;
        	default: answer = "Invalid Expression";
                break;
		}
		
		return answer;
	}

}
