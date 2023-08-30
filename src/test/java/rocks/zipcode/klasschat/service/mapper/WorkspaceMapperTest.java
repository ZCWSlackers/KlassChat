package rocks.zipcode.klasschat.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class WorkspaceMapperTest {

    private WorkspaceMapper workspaceMapper;

    @BeforeEach
    public void setUp() {
        workspaceMapper = new WorkspaceMapperImpl();
    }
}
