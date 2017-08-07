/**
 * created at 2012-11-12
 */
package tools;

import org.junit.Test;

import bingo.metabase.MbProtected;
import bingo.metabase.repository.MbRepoManager;

public class MbUtils {

	public static void setUpgrade(){
		MbProtected.execute(new MbProtected.Action() {
			public void run() {
				setUpgrade();
			}
		});
	}
	
	@Test
	public void init() {
		MbRepoManager.get().create();
	}
	
}
