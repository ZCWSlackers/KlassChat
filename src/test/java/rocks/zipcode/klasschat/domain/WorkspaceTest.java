package rocks.zipcode.klasschat.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.klasschat.web.rest.TestUtil;

class WorkspaceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Workspace.class);
        Workspace workspace1 = new Workspace();
        workspace1.setId(1L);
        Workspace workspace2 = new Workspace();
        workspace2.setId(workspace1.getId());
        assertThat(workspace1).isEqualTo(workspace2);
        workspace2.setId(2L);
        assertThat(workspace1).isNotEqualTo(workspace2);
        workspace1.setId(null);
        assertThat(workspace1).isNotEqualTo(workspace2);
    }
}
